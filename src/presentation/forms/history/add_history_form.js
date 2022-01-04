import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  setDoc,
  doc,
  uploadBytesResumable,
  getDownloadURL,
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, Grid } from "@mui/material";
import { Typography } from "@mui/material";
import RichText from "../../components/misc/richtext";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 120,
    height: 100,
  },
  mb: {
    marginBottom: 10,
  },
}));

const CircularProgressWithLabel = (props) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        {...props}
        size={90}
        thickness={3.0}
        style={{ color: "green" }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="body1"
          component="div"
          style={{ color: "white", fontFamily: "roboto" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

const AddHistoryForm = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
    image: "",
    category: "",
    body: "",
    summary: "",
    createdAt: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const [content, setContent] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createHistory = (e) => {
    setIsUploading(true);
    //First upload images to firebase storage then save to firestore
    const timeNow = new Date();
    let storageRef = ref(storage, "history/" + timeNow.getTime());
    let uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uprogress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uprogress);
      },
      (error) => {
        setIsUploading(false);
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsUploading(false);
          setIsLoading(true);
          setDoc(doc(db, "history", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            title: formValues.title,
            image: downloadURL,
            body: content,
            summary: formValues.summary,
            createdAt: timeNow,
            updatedAt: timeNow,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`History added successfully`, {
                variant: "success",
              });
            })
            .catch((error) => {
              setIsLoading(false);
              enqueueSnackbar(
                `${error?.message || "Check your internet connection"}`,
                {
                  variant: "error",
                }
              );
            });
        });
      }
    );
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isUploading || isLoading}>
        {isUploading ? <CircularProgressWithLabel value={progress} /> : <div />}
        {isLoading ? (
          <CircularProgress
            size={90}
            thickness={3.0}
            style={{ color: "white" }}
          />
        ) : (
          <div />
        )}
      </Backdrop>
      <ValidatorForm onSubmit={createHistory}>
        <Grid container spacing={1} padding={1}>
          <Grid item xs={12} sm={6} md={7}>
            <TextValidator
              id="image"
              size="small"
              variant="outlined"
              value={formValues.image}
              name="image"
              type="file"
              fullWidth
              disabled={isLoading}
              accept=".png, .jpg, .jpeg"
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["Featured image is required"]}
              helperText="Featured image"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              {previewImage && (
                <Avatar
                  variant="rounded"
                  alt="Passport"
                  src={previewImage}
                  className={classes.image}
                />
              )}
            </div>
          </Grid>
        </Grid>

        <TextValidator
          className={classes.mb}
          id="title"
          label="Title"
          size="small"
          variant="outlined"
          value={formValues.title}
          onChange={handleChange}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["Title is required"]}
        />

        <RichText
          value={content}
          setValue={setContent}
          error={isError}
          setError={setIsError}
          setIsStartedFilling={setIsStartedFilling}
        />

        <TextValidator
          className={classes.mb}
          label="Summary"
          multiLine={true}
          rows={2}
          rowsMax={2}
          size="small"
          variant="outlined"
          value={formValues.summary}
          onChange={handleChange}
          name="summary"
          fullWidth
          validators={["required"]}
          errorMessages={["Brief summary is required"]}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Save
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default AddHistoryForm;

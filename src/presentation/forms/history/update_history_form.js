import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  doc,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  updateDoc,
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useLocation } from "react-router-dom";
import placeholder from "../../../assets/images/placeholder.png";
import QuillEditable from "../../components/misc/richtext/edit_quill";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 128,
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

const EditHistoryForm = () => {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  let { id, title, image, body, summary } = location?.state;
  const [formValues, setFormValues] = React.useState({
    title: title,
    image: "",
    summary: summary,
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");

  const [content, setContent] = React.useState(body);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      try {
        if (e.target.files[0]) {
          setPreviewImage(URL.createObjectURL(e.target.files[0]));
        } else {
          setPreviewImage(placeholder);
        }
      } catch (e) {}

      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "history/" + timeNow.getTime());
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uprogress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uprogress);
      },
      (error) => {
        setIsUploading(false);
        enqueueSnackbar(`${error?.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "history", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              body: content,
              summary: formValues.summary,
              updatedAt: timeNow,
              image: downloadURL,
            });
            setIsLoading(false);
            enqueueSnackbar(`History updated successfully`, {
              variant: "success",
            });
            history.goBack();
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(
              `${error?.message || "Check your internet connection"}`,
              {
                variant: "error",
              }
            );
          }
        });
      }
    );
  };

  const updateHistory = async (e) => {
    setIsLoading(true);

    if (!previewImage) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "history", "" + id);
        await updateDoc(mRef, {
          title: formValues.title,
          body: content,
          summary: formValues.summary,
          updatedAt: timeNow,
        });
        setIsLoading(false);
        enqueueSnackbar(`History updated successfully`, {
          variant: "success",
        });
        history.goBack();
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message}`, {
          variant: "error",
        });
      }
    } else if (previewImage) {
      //Change on the featured image and all texts
      const fileRef = ref(storage, "history/" + id);

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewImage();
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
    }
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
      <ValidatorForm onSubmit={updateHistory}>
        <Box
          width={"100%"}
          display="flex"
          flexDirection="row"
          justifyContent="start"
          alignItems={"start"}
          paddingBottom={2}
        >
          <Button
            disableElevation
            variant="contained"
            startIcon={<ArrowBackIosNew />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography px={4} variant="h6">
            Update History
          </Typography>
        </Box>
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
              helperText="Featured image"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                variant="rounded"
                alt="Passport"
                src={previewImage ? previewImage : image}
                className={classes.image}
              />
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

        <QuillEditable setValue={setContent} value={content} />
        <br />

        <TextValidator
          className={classes.mb}
          label="Summary"
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
          Update
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default EditHistoryForm;

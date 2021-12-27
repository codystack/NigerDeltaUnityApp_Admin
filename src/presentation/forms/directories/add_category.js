import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  setDoc,
  doc,
  uploadBytesResumable,
  getDownloadURL,
} from "../../../data/firebase/";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";
import placeholder from "../../../assets/images/placeholder.png";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 128,
    height: 128,
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

const DirAddCategoryForm = (props) => {
  let { setOpen } = props;
  const classes = useStyles();
  const [formValues, setFormValues] = React.useState({
    title: "",
    image: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState(placeholder);
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    if (id === "image") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    }
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const createCategory = (e) => {
    const timeNow = new Date();
    let storageRef = ref(
      storage,
      "directories-categories/" + timeNow.getTime()
    );
    let uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (download) => {
          setIsUploading(false);
          setIsLoading(true);
          setDoc(doc(db, "directories-categories", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            name: formValues.title,
            image: download,
            createdAt: timeNow,
            updatedAt: timeNow,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`New category added successfully`, {
                variant: "success",
              });
            })
            .catch((error) => {
              setIsLoading(false);
              enqueueSnackbar(
                `${error?.message || "Check your internet connnection!"}`,
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
      <ValidatorForm onSubmit={createCategory}>
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
          errorMessages={["Category image is required"]}
          helperText="Upload category image"
        />

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

        <TextValidator
          id="title"
          label="Category name"
          size="small"
          variant="outlined"
          value={formValues.title}
          onChange={handleChange}
          // onBlur={handleBlur}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["Category name is required"]}
        />

        <br />
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

export default DirAddCategoryForm;

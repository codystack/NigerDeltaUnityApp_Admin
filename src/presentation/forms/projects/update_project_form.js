import React from "react";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  doc,
  query,
  collection,
  onSnapshot,
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
import { MenuItem } from "@mui/material";
import { FirebaseError } from "@firebase/util";

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

const EditProjectForm = (props) => {
  const classes = useStyles();
  let { setOpen, id, title, img, state, desc } = props;
  const [formValues, setFormValues] = React.useState({
    title: title,
    image: "",
    state: state,
    desc: desc,
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const [statesList, setStatesList] = React.useState(null);
  const [stateId, setStateId] = React.useState(0);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const q = query(collection(db, "states"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const states = [];
      querySnapshot.forEach((doc) => {
        states.push(doc.data());
      });
      setStatesList(states);
    });
  }, []);

  const handleChange = async (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else if (name === "state") {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
      let item = await statesList?.find((item) => item?.name === value);
      setStateId(item?.id);
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "projects/" + timeNow.getTime());
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
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "projects", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              state: formValues.state,
              stateId: stateId,
              description: formValues.desc,
              updatedAt: timeNow,
              image: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Project updated successfully`, {
              variant: "success",
            });
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

  const updateProject = async (e) => {
    setIsLoading(true);

    setFormValues({
      title: formValues.title ? formValues.title : title,
      state: formValues.state ? formValues.state : state,
      desc: formValues?.desc ? formValues.desc : desc,
    });
    if (previewImage) {
      //Change only the featured image and all texts
      const fileRef = ref(storage, "projects/" + id);

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
    } else {
      // const fileRef = ref(storage, "projects/" + id);
      const timeNow = new Date();
      setIsLoading(true);
      try {
        const mRef = doc(db, "projects", "" + id);
        await updateDoc(mRef, {
          title: formValues.title,
          state: formValues.state,
          stateId: stateId,
          description: formValues.desc,
          updatedAt: timeNow,
        });
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`Project updated successfully`, {
          variant: "success",
        });
      } catch (error) {
        setIsLoading(false);
        setIsUploading(false);
        enqueueSnackbar(
          `${error?.message || "Check your internet connection"}`,
          {
            variant: "error",
          }
        );
      }
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
      <ValidatorForm onSubmit={updateProject}>
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
              accept=".png, .jpg, .jpeg, .pdf"
              onChange={handleChange}
              helperText="Featured image"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                variant="rounded"
                alt="Passport"
                src={previewImage ? previewImage : img}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>

        <SelectValidator
          id="state"
          className={classes.mb}
          value={formValues.state ? formValues.state : state}
          onChange={handleChange}
          label="Project state"
          name="state"
          fullWidth
          variant="outlined"
          size="small"
          validators={["required"]}
          errorMessages={["Project state is required"]}
        >
          {(statesList ?? [])?.map((item, index) => (
            <MenuItem key={index} value={item?.name ?? ""}>
              {item?.name ?? ""}
            </MenuItem>
          ))}
        </SelectValidator>

        <TextValidator
          className={classes.mb}
          id="title"
          label="Project title"
          size="small"
          variant="outlined"
          value={
            formValues.title === " "
              ? title
              : !formValues.title
              ? ""
              : formValues.title
          }
          onChange={handleChange}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["Project title is required"]}
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          multiline
          rows={5}
          rowsMax={10}
          placeholder="Type project description here"
          name="desc"
          label="Project Description"
          value={
            formValues.desc === " "
              ? desc
              : !formValues.desc
              ? ""
              : formValues.desc
          }
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["News content is required"]}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Update Project
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default EditProjectForm;

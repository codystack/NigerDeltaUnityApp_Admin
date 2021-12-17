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
  setDoc,
  doc,
  uploadBytesResumable,
  getDownloadURL,
  query,
  collection,
  updateDoc,
  onSnapshot,
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, Grid, MenuItem } from "@mui/material";
import { Typography } from "@mui/material";

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

const AddProjectForm = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
    image: "",
    state: "",
    desc: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [statesList, setStatesList] = React.useState([
    "Akwa Ibom State",
    "Bayelsa State",
    "Cross River State",
    "Delta State",
    "Edo State",
    "Rivers State",
  ]);

  //   React.useEffect(() => {
  //     const q = query(collection(db, "categories"));
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       const categories = [];
  //       querySnapshot.forEach((doc) => {
  //         categories.push(doc.data());
  //       });
  //       setCategoriesList(categories);
  //     });
  //   }, []);

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

  const createProject = (e) => {
    setIsUploading(true);

    //First upload images to firebase storage then save to firestore
    const timeNow = new Date();
    let storageRef = ref(storage, "projects/" + timeNow.getTime());
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
          setDoc(doc(db, "projects", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            title: formValues.title,
            image: downloadURL,
            state: formValues.state,
            description: formValues.desc,
            createdAt: timeNow,
            updatedAt: timeNow,
          })
            .then((res) => {
              //Now upload author image
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`New project added successfully`, {
                variant: "success",
              });
            })
            .catch((error) => {
              setIsUploading(false);
              setIsLoading(false);
              enqueueSnackbar(`${error?.message}`, {
                variant: "error",
              });
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
      <ValidatorForm onSubmit={createProject}>
        <Grid container spacing={1} padding={1}>
          <Grid xs={12} sm={6} md={7}>
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
              validators={["required"]}
              errorMessages={["Featured image is required"]}
              helperText="Featured image"
            />
          </Grid>

          <Grid xs={12} sm={6} md={5}>
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

        <SelectValidator
          className={classes.mb}
          value={formValues.state}
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
            <MenuItem key={index} value={item ?? ""}>
              {item ?? ""}
            </MenuItem>
          ))}
        </SelectValidator>

        <TextValidator
          className={classes.mb}
          id="title"
          label="Project title"
          size="small"
          variant="outlined"
          value={formValues.title}
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
          placeholder="Project description here"
          name="desc"
          label="Project description"
          value={formValues.desc}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Project description is required"]}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Create Project
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default AddProjectForm;

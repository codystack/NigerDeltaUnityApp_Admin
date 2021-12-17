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
    title: " ",
    image: "",
    state: " ",
    desc: " ",
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

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "news/" + timeNow.getTime());
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
          const mRef = doc(db, "news", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              subTitle: formValues.subTitle,
              authorName: formValues.authorName,
              category: formValues.category,
              body: formValues.body,
              updatedAt: timeNow,
              image: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Newsfeed updated successfully`, {
              variant: "success",
            });
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(`${error?.message}`, {
              variant: "error",
            });
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
          console.log("ErR: ", error);
        });
    } else {
      const fileRef = ref(storage, "projects/" + id);

      setIsLoading(true);

      deleteObject(fileRef)
        .then(() => {
          const timeNow = new Date();
          let storageRef = ref(storage, "projects/" + timeNow.getTime());
          let uploadTask = uploadBytesResumable(storageRef, file);

          setIsLoading(false);
          setIsUploading(true);

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
              enqueueSnackbar(`${error?.message}`, { variant: "error" });
            },
            () => {
              setIsUploading(false);
              setIsLoading(true);
              getDownloadURL(uploadTask?.snapshot?.ref).then(
                async (downloadURL) => {
                  try {
                    const mRef = doc(db, "projects", "" + id);
                    await updateDoc(mRef, {
                      title: formValues.title,
                      state: formValues.state,
                      description: formValues.desc,
                      updatedAt: timeNow,
                      image: downloadURL,
                    });
                    setOpen(false);
                    setIsLoading(false);
                    enqueueSnackbar(`Project updated successfully`, {
                      variant: "success",
                    });
                  } catch (error) {}
                }
              );
            }
          );
        })
        .catch((error) => {
          setIsLoading(false);
          setIsUploading(false);
          console.log("ErR: ", error);
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
      <ValidatorForm onSubmit={updateProject}>
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
              helperText="Featured image"
            />
          </Grid>

          <Grid xs={12} sm={6} md={5}>
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

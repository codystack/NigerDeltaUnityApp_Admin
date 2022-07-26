import React from "react";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  doc,
  uploadBytesResumable,
  getDownloadURL,
  query,
  collection,
  onSnapshot,
  deleteObject,
  updateDoc,
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/system/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Edit from "@mui/icons-material/Edit";
import { useHistory, useLocation } from "react-router-dom";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import placeholder from "../../../assets/images/placeholder.png";

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

const EditEducationForm = () => {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  let { id, title, category, url, description, image } = location?.state;

  const [formValues, setFormValues] = React.useState({
    title: title,
    image: "",
    category: category,
    url: url,
    description: description,
  });

  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState(null);
  const [dummyImage, setDummyImage] = React.useState(image);

  const { enqueueSnackbar } = useSnackbar();

  const [categoriesList, setCategoriesList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "education-categories"));
    onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setCategoriesList(categories);
    });
  }, []);

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      try {
        if (e.target.files[0]) {
          setPreviewImage(URL.createObjectURL(e.target.files[0]));
          setDummyImage(URL.createObjectURL(e.target.files[0]));
        } else {
          setPreviewImage(placeholder);
          setDummyImage(placeholder);
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
    const storageRef = ref(storage, "education/" + timeNow.getTime());
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
        enqueueSnackbar(
          `${error.message || "Check your internet connection"}`,
          { variant: "error" }
        );
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "education", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              url: formValues.url,
              description: formValues.description,
              category: formValues.category,
              updatedAt: timeNow,
              image: downloadURL,
            });
            setIsLoading(false);
            enqueueSnackbar(`Data updated successfully`, {
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

  const updateEducation = async (e) => {
    console.log("HELLOION:::");
    setIsLoading(true);
    e.preventDefault();

    if (!previewImage) {
      console.log("HJGG");
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "education", "" + id);
        await updateDoc(mRef, {
          title: formValues.title,
          url: formValues.url,
          description: formValues.description,
          category: formValues.category,
          updatedAt: timeNow,
        });
        setIsLoading(false);
        enqueueSnackbar(`Data updated successfully`, {
          variant: "success",
        });
        history.goBack();
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message || "Check internet connection"}`, {
          variant: "error",
        });
      }
    } else if (previewImage) {
      console.log("YYYY");
      //Change on the featured image and all texts
      const fileRef = ref(storage, "education/" + id);

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewImage();
        })
        .catch((error) => {
          setIsLoading(false);
          enqueueSnackbar(`${error?.message || "Check internet connection"}`, {
            variant: "error",
          });
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

      <ValidatorForm onSubmit={updateEducation}>
        <Box
          width={"100%"}
          display="flex"
          flexDirection="row"
          justifyContent="start"
          alignItems={"start"}
          paddingBottom={2}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIosNew />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography px={4} variant="h6">
            Update Education
          </Typography>
        </Box>
        <TextValidator
          id="image"
          size="small"
          style={{ display: "none" }}
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

        <label
          htmlFor="image"
          style={{
            display: "flex",
            flexDirection: "column",
            height: 256,
            width: "100%",
            backgroundImage: "url(" + dummyImage + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            marginBottom: 24,
          }}
          typeof="file"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              alignItems: "center",
              marginTop: "auto",
              marginBottom: -32,
            }}
          >
            <label htmlFor="image" style={{ marginBottom: 24, padding: 8 }}>
              <div className={classes.subRow}>
                <Edit color="primary" fontSize="small" />
                <Typography color="blue">Edit</Typography>
              </div>
            </label>
          </div>
        </label>

        <Grid container spacing={1} padding={0} marginBottom={0}>
          <Grid item xs={12} sm={6} md={6}>
            <div>
              <SelectValidator
                className={classes.mb}
                value={formValues.category}
                onChange={handleChange}
                label="Category"
                name="category"
                fullWidth
                variant="outlined"
                size="small"
                validators={["required"]}
                errorMessages={["Category is required"]}
              >
                {(categoriesList ?? [])?.map((item, index) => (
                  <MenuItem key={index} value={item?.name ?? ""}>
                    {item?.name ?? ""}
                  </MenuItem>
                ))}
              </SelectValidator>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <div>
              <TextValidator
                className={classes.mb}
                label="Title"
                size="small"
                variant="outlined"
                value={formValues.title}
                onChange={handleChange}
                name="title"
                required
                fullWidth
                validators={["required"]}
                errorMessages={["Title is required"]}
              />
            </div>
          </Grid>
        </Grid>

        <TextValidator
          className={classes.mb}
          label="Website link (Optional)"
          size="small"
          variant="outlined"
          required
          value={formValues.url}
          onChange={handleChange}
          name="url"
          fullWidth
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          multiline
          rows={4}
          placeholder="Briefly describe here..."
          name="description"
          label="Description"
          value={formValues.description}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Description is required"]}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Update Now
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default EditEducationForm;

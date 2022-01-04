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
import { Checkbox, CircularProgress, Grid, MenuItem } from "@mui/material";
import { Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CameraAlt } from "@mui/icons-material";
import placeholder from "../../../assets/images/placeholder.png";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: "100%",
    height: 156,
  },
  logo: {
    margin: "0px auto 15px auto",
    width: 48,
    height: 48,
  },
  mb: {
    marginBottom: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
    alignItems: "center",
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

const AddEducationForm = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
    image: "",
    category: "",
    url: "",
    description: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState(placeholder);
  const { enqueueSnackbar } = useSnackbar();
  const [categoriesList, setCategoriesList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "education-categories"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createEducation = (e) => {
    setIsUploading(true);

    //First upload images to firebase storage then save to firestore
    const timeNow = new Date();
    let storageRef = ref(storage, "education/" + timeNow.getTime());
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
        enqueueSnackbar(
          `${error?.message || "Check your internet connection"}`,
          { variant: "error" }
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsUploading(false);
          setIsLoading(true);
          setDoc(doc(db, "education", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            title: formValues.title,
            image: downloadURL,
            category: formValues.category,
            url: formValues.url,
            description: formValues.description,
            createdAt: timeNow,
            updatedAt: timeNow,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`Data added successfully`, {
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
      <ValidatorForm onSubmit={createEducation}>
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
            height: 144,
            width: 420,
            backgroundImage: "url(" + previewImage + ")",
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
                <EditIcon color="primary" fontSize="small" />
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
                errorMessages={["Education category is required"]}
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
                id="title"
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
          value={formValues.url}
          onChange={handleChange}
          name="url"
          fullWidth
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          multiline
          rows={3}
          rowsMax={4}
          placeholder="Briefly describe here..."
          name="description"
          label="Description"
          value={formValues.description}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Description is required"]}
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

export default AddEducationForm;

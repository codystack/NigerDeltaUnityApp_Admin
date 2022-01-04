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
import Edit from "@mui/icons-material/Edit";
import DatePicker from "../../components/misc/datepicker";

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

const places = ["Home page", "Directories", "News"];

const UpdateAdsForm = (props) => {
  const classes = useStyles();
  let { setOpen, id, banner, url, startDate, endDate, location } = props;
  const [formValues, setFormValues] = React.useState({
    banner: "",
    url: url,
    starts: startDate,
    ends: endDate,
    placement: location,
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState(banner);
  const { enqueueSnackbar } = useSnackbar();
  const coverRef = React.useRef();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "banner") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        banner: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "ads/" + timeNow.getTime());
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
        enqueueSnackbar(`${error.message || "Check internet connection"}`, {
          variant: "error",
        });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "ads", "" + id);
          try {
            await updateDoc(mRef, {
              url: formValues.url,
              placement: formValues.placement,
              starts: formValues.starts,
              ends: formValues.ends,
              updatedAt: timeNow,
              banner: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Ad updated successfully`, {
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

  const updateAd = async (e) => {
    setIsLoading(true);
    // setFormValues({
    //   title: formValues.title ? formValues.title : title,
    //   subTitle: formValues.subTitle ? formValues.subTitle : subTitle,
    //   authorName: formValues.authorName ? formValues.authorName : authorName,
    //   category: formValues.category ? formValues.category : category,
    //   body: formValues.body ? formValues.body : body,
    // });
    if (!previewImage) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "ads", "" + id);
        await updateDoc(mRef, {
          url: formValues.url,
          placement: formValues.placement,
          starts: formValues.starts,
          ends: formValues.ends,
          updatedAt: timeNow,
        });
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`Ads updated successfully`, {
          variant: "success",
        });
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message || "Check internet connection"}`, {
          variant: "error",
        });
      }
    } else if (previewImage) {
      //Change on the featured image and all texts
      const fileRef = ref(storage, "ads/" + id);

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
      <ValidatorForm onSubmit={updateAd}>
        <TextValidator
          ref={coverRef}
          id="banner"
          size="small"
          style={{ display: "none" }}
          variant="outlined"
          value={formValues.banner}
          name="banner"
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
          htmlFor="banner"
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
            <label htmlFor="banner" style={{ marginBottom: 24, padding: 8 }}>
              <div className={classes.subRow}>
                <Edit color="primary" fontSize="small" />
                <Typography color="blue">Edit</Typography>
              </div>
            </label>
          </div>
        </label>

        <TextValidator
          className={classes.mb}
          label="Url Link"
          size="small"
          variant="outlined"
          required
          value={formValues.url}
          onChange={handleChange}
          name="url"
          fullWidth
          validators={["required"]}
          errorMessages={["Ad's url link is required"]}
        />

        <Grid container spacing={1} padding={0} marginBottom={0}>
          <Grid item xs={12} sm={6} md={6}>
            <div>
              <DatePicker
                id="starts"
                value={formValues.starts}
                label="Start Date"
                setFormData={setFormValues}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <div>
              <DatePicker
                id="ends"
                value={formValues.ends}
                label="End Date"
                setFormData={setFormValues}
              />
            </div>
          </Grid>
        </Grid>

        <SelectValidator
          className={classes.mb}
          value={formValues.placement}
          onChange={handleChange}
          label="Placement"
          name="placement"
          fullWidth
          variant="outlined"
          size="small"
          validators={["required"]}
          errorMessages={["Ad placement is required"]}
        >
          {(places ?? [])?.map((item, index) => (
            <MenuItem key={index} value={item ?? ""}>
              {item ?? ""}
            </MenuItem>
          ))}
        </SelectValidator>
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Create Ad
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdateAdsForm;

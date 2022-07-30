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
import { Avatar, CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { MenuItem } from "@mui/material";
import DatePicker from "../../components/misc/datepicker";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useLocation } from "react-router-dom";

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

const places = ["Home page", "Directories"];

const UpdateAdsForm = () => {
  const location = useLocation();
  const classes = useStyles();
  const history = useHistory();
  let { id, banner, url, startDate, endDate, placement } = location?.state;
  const [formValues, setFormValues] = React.useState({
    banner: "",
    url: url,
    starts: startDate,
    ends: endDate,
    placement: placement,
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "banner") {
      setFile(e.target.files[0]);
      try {
        if (e.target.files[0]) {
          setPreviewImage(URL.createObjectURL(e.target.files[0]));
        } else {
          setPreviewImage(banner);
        }
      } catch (e) {}

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
            setIsLoading(false);
            enqueueSnackbar(`Ad updated successfully`, {
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

  const updateAd = async (e) => {
    setIsLoading(true);

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
        setIsLoading(false);
        enqueueSnackbar(`Ads updated successfully`, {
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
        <Box
          width={"100%"}
          display="flex"
          flexDirection="row"
          justifyContent="start"
          alignItems={"start"}
          paddingBottom={2}
        >
          <Button
            variant="text"
            startIcon={<ArrowBackIosNew />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography px={4} variant="h6">
            Update Advert
          </Typography>
        </Box>

        <Grid container spacing={1} padding={1}>
          <Grid item xs={12} sm={6} md={7}>
            <TextValidator
              id="banner"
              size="small"
              variant="outlined"
              value={formValues.banner}
              name="banner"
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
                src={previewImage ? previewImage : banner}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>

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
          Update Now
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdateAdsForm;

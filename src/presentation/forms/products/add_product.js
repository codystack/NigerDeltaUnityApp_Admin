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

const AddProductForm = (props) => {
  const classes = useStyles();
  let {
    setOpen,
    vendorID,
    vendorAddress,
    vendorName,
    vendorPhone,
    vendorWebsite,
  } = props;
  let deliveryTypes = ["Free delivery", "Pick up", "Pay on delivery"];
  const [formValues, setFormValues] = React.useState({
    name: "",
    image: "",
    vendorName: "",
    delivery: "",
    vendorAddress: "",
    vendorPhone: "",
    vendorWebsite: "",
    description: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
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
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createNews = (e) => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload images to firebase storage then save to firestore
    let storageRef = ref(storage, "products/" + timeNow.getTime());
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
          setDoc(doc(db, "products", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            name: formValues.name,
            image: downloadURL,
            delivery: formValues.delivery,
            vendorID: vendorID,
            vendorName: vendorName,
            vendorPhone: vendorPhone,
            vendorAddress: vendorAddress,
            vendorWebsite: vendorWebsite,
            description: formValues.description,
            createdAt: timeNow,
            updatedAt: timeNow,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`New product added successfully`, {
                variant: "success",
              });
            })
            .catch((error) => {
              setIsLoading(false);
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
      <ValidatorForm onSubmit={createNews}>
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
              errorMessages={["Product image is required"]}
              helperText="Product image"
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

        <SelectValidator
          className={classes.mb}
          value={formValues.delivery}
          onChange={handleChange}
          label="Delivery type"
          name="delivery"
          fullWidth
          variant="outlined"
          size="small"
          validators={["required"]}
          errorMessages={["Delivery type is required"]}
        >
          {(deliveryTypes ?? [])?.map((item, index) => (
            <MenuItem key={index} value={item ?? ""}>
              {item ?? ""}
            </MenuItem>
          ))}
        </SelectValidator>

        <TextValidator
          className={classes.mb}
          id="name"
          label="Product name"
          size="small"
          variant="outlined"
          value={formValues.name}
          onChange={handleChange}
          name="name"
          fullWidth
          validators={["required"]}
          errorMessages={["Product name is required"]}
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          multiline
          rows={5}
          rowsMax={10}
          placeholder="Type description here"
          name="description"
          label="Product description"
          value={formValues.description}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Product description is required"]}
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

export default AddProductForm;

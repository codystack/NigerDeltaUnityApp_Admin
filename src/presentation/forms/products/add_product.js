import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
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
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, Grid, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import placeholder from "../../../assets/images/placeholder.png";
import NumberFormat from "react-number-format";
import QuillEditor from "../../components/misc/richtext/quill";

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
  let { setOpen, vendorID, vendorAddress, vendorPhone, vendorName } = props;
  // let deliveryTypes = ["Free delivery", "Pick up", "Pay on delivery"];
  const [formValues, setFormValues] = React.useState({
    name: "",
    image: "",
    vendorAddress: "",
    vendorPhone: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState(placeholder);
  const [price, setPrice] = React.useState();
  const [description, setDescription] = React.useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      try {
        setFile(e.target.files[0]);
        if (e.target?.files[0]) {
          setPreviewImage(URL.createObjectURL(e.target?.files[0]));
        } else {
          setPreviewImage(placeholder);
        }
        setFormValues((prevData) => ({
          ...prevData,
          image: e.target.value,
        }));
      } catch (e) {}
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createCatalog = (e) => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload images to firebase storage then save to firestore
    let storageRef = ref(storage, vendorName + "catalog/" + timeNow.getTime());
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
          setDoc(doc(db, "catalogs", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            name: formValues.name,
            image: downloadURL,
            vendorID: vendorID,
            vendorName: vendorName,
            vendorPhone: vendorPhone,
            vendorAddress: vendorAddress,
            description: description,
            price: price,
            createdAt: timeNow,
            updatedAt: timeNow,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`New catalog added successfully`, {
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
      <ValidatorForm onSubmit={createCatalog}>
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
              errorMessages={["Image is required"]}
              helperText="Featured image"
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

        <TextValidator
          className={classes.mb}
          id="name"
          label="Title"
          size="small"
          variant="outlined"
          value={formValues.name}
          onChange={handleChange}
          name="name"
          fullWidth
          required
          validators={["required"]}
          errorMessages={["Title is required"]}
        />

        <NumberFormat
          customInput={TextField}
          onValueChange={(values) => setPrice(values.value)}
          value={price}
          thousandSeparator={true}
          prefix={"₦"}
          fullWidth
          size="small"
          placeholder="Enter price"
          variant="outlined"
          label="Price"
          required
        />
        <br />
        <br />

        <QuillEditor
          setValue={setDescription}
          placeholder={"Type description here..."}
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

export default AddProductForm;

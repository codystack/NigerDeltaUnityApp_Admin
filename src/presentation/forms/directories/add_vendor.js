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
import { ArrowBackIosNew, CameraAlt } from "@mui/icons-material";
import placeholder from "../../../assets/images/placeholder.png";
import { useHistory } from "react-router-dom";

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

const timesOpen = [
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
];

const timesClosed = [
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
  "12:00 AM",
];

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

const AddVendorForm = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const [formValues, setFormValues] = React.useState({
    name: "",
    image: "",
    logo: "",
    category: "",
    address: "",
    description: "",
    phone: "",
    website: "",
    opensAt: "",
    closesAt: "",
    is24Hrs: false,
  });
  const [file, setFile] = React.useState(null);
  const [logoFile, setLogoFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState(placeholder);
  const [previewLogo, setPreviewLogo] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [categoriesList, setCategoriesList] = React.useState(null);
  const coverRef = React.useRef();
  const [is24Hrs, setIs24Hrs] = React.useState(false);

  React.useEffect(() => {
    const q = query(collection(db, "directories-categories"));
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
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else if (id === "logo") {
      setLogoFile(e.target.files[0]);
      setPreviewLogo(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        logo: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createVendor = (e) => {
    setIsUploading(true);

    //First upload images to firebase storage then save to firestore
    const timeNow = new Date();
    let storageRef = ref(storage, "vendors/" + timeNow.getTime());
    let storageRef2 = ref(storage, "vendors/img_" + timeNow.getTime());
    let uploadTask = uploadBytesResumable(storageRef, file);
    let uploadTask2 = uploadBytesResumable(storageRef2, logoFile);
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
          setDoc(doc(db, "directories-vendors", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            name: formValues.name,
            image: downloadURL,
            category: formValues.category,
            address: formValues.address,
            phone: formValues.phone,
            website: formValues.website,
            description: formValues.description,
            opensAt: is24Hrs ? " " : formValues.opensAt,
            closesAt: is24Hrs ? " " : formValues.closesAt,
            is24Hours: is24Hrs,
            logo: " ",
            blocked: false,
            createdAt: timeNow,
            updatedAt: timeNow,
            listings: [],
          })
            .then((res) => {
              //Now upload author image
              const tmn = timeNow.getTime();
              setIsUploading(true);
              setIsLoading(false);
              uploadTask2.on(
                "state_changed",
                (snapshot2) => {
                  const prog =
                    (snapshot2.bytesTransferred / snapshot2.totalBytes) * 100;
                  setProgress(prog);
                },
                (error) => {
                  setIsUploading(false);
                  console.log(error);
                  enqueueSnackbar(`${error.message}`, { variant: "error" });
                },
                () => {
                  getDownloadURL(uploadTask2.snapshot.ref).then(
                    async (download) => {
                      setIsUploading(false);
                      setIsLoading(true);
                      try {
                        const mRef = doc(db, "directories-vendors", "" + tmn);
                        await updateDoc(mRef, {
                          logo: download,
                        });
                        // setOpen(false);
                        setIsLoading(false);
                        enqueueSnackbar(`New vendor added successfully`, {
                          variant: "success",
                        });
                        history.goBack();
                      } catch (error) {
                        setIsLoading(false);
                        enqueueSnackbar(`${error?.message}`, {
                          variant: "error",
                        });
                      }
                    }
                  );
                }
              );
            })
            .catch((error) => {
              setIsLoading(false);
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
      <ValidatorForm onSubmit={createVendor}>
        <Box
          width={"100%"}
          display="flex"
          flexDirection={"row"}
          justifyContent="start"
          alignItems={"start"}
          paddingY={2}
        >
          <Button
            startIcon={<ArrowBackIosNew />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
        </Box>
        <TextValidator
          ref={coverRef}
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

        <TextValidator
          className={classes.mb}
          id="logo"
          size="small"
          variant="outlined"
          style={{ display: "none" }}
          value={formValues.logo}
          name="logo"
          type="file"
          fullWidth
          disabled={isLoading}
          accept=".png, .jpg, .jpeg,"
          onChange={handleChange}
          validators={["required"]}
          errorMessages={["Vendor's logo is required"]}
          helperText="Vendor's logo"
        />

        <label
          htmlFor="image"
          style={{
            display: "flex",
            flexDirection: "column",
            height: 144,
            width: "100%",
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
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto",
              marginBottom: -32,
            }}
          >
            <label
              htmlFor="logo"
              style={{
                zIndex: 1000,
                display: "flex",
                flexDirection: "row",
                padding: 5,
              }}
            >
              <Avatar
                variant="circular"
                alt="Author"
                src={previewLogo}
                className={classes.logo}
              />
              <label htmlFor="logo" style={{ marginTop: 16, marginLeft: -10 }}>
                <div className={classes.subRow}>
                  <CameraAlt
                    style={{ color: "white", zIndex: 10000 }}
                    fontSize="small"
                  />
                </div>
              </label>
            </label>
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
                errorMessages={["Vendor's category is required"]}
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
                id="name"
                label="Vendor name"
                size="small"
                variant="outlined"
                value={formValues.name}
                onChange={handleChange}
                name="name"
                required
                fullWidth
                validators={["required"]}
                errorMessages={["Vendor's name is required"]}
              />
            </div>
          </Grid>
        </Grid>

        <TextValidator
          className={classes.mb}
          id="address"
          label="Vendor address"
          size="small"
          variant="outlined"
          required
          value={formValues.address}
          onChange={handleChange}
          name="address"
          fullWidth
          validators={["required"]}
          errorMessages={["Vendor's address is required"]}
        />

        <Grid container spacing={1} padding={0} marginBottom={0}>
          <Grid item xs={12} sm={6} md={6}>
            <div>
              <TextValidator
                className={classes.mb}
                id="phone"
                label="Phone number"
                size="small"
                variant="outlined"
                value={formValues.phone}
                onChange={handleChange}
                name="phone"
                fullWidth
                required
                type="phone"
                validators={["required"]}
                errorMessages={["Vendor's phone number is required"]}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <div>
              <TextValidator
                className={classes.mb}
                id="website"
                label="Website (Optional)"
                size="small"
                variant="outlined"
                value={formValues.website}
                onChange={handleChange}
                name="website"
                fullWidth
              />
            </div>
          </Grid>
        </Grid>

        <TextValidator
          className={classes.mb}
          fullWidth
          multiline
          rows={4}
          rowsMax={5}
          placeholder="Briefly describe vendor"
          name="description"
          label="Description"
          value={formValues.description}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Vendor's description is required"]}
        />

        <div className={classes.row}>
          {!is24Hrs ? (
            <Grid container spacing={1} padding={0} marginBottom={0}>
              <Grid item xs={12} sm={6} md={6}>
                <div>
                  <SelectValidator
                    className={classes.mb}
                    value={formValues.opensAt}
                    onChange={handleChange}
                    label="Opens By"
                    name="opensAt"
                    fullWidth
                    variant="outlined"
                    size="small"
                    validators={["required"]}
                    errorMessages={["Opening time is required"]}
                  >
                    {(timesOpen ?? [])?.map((item, index) => (
                      <MenuItem key={index} value={item ?? ""}>
                        {item ?? ""}
                      </MenuItem>
                    ))}
                  </SelectValidator>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <div>
                  <SelectValidator
                    className={classes.mb}
                    value={formValues.closesAt}
                    onChange={handleChange}
                    label="Closes By"
                    name="closesAt"
                    fullWidth
                    variant="outlined"
                    size="small"
                    validators={["required"]}
                    errorMessages={["Closing time is required"]}
                  >
                    {(timesClosed ?? [])?.map((item, index) => (
                      <MenuItem key={index} value={item ?? ""}>
                        {item ?? ""}
                      </MenuItem>
                    ))}
                  </SelectValidator>
                </div>
              </Grid>
            </Grid>
          ) : (
            <Typography>Always open 24/7</Typography>
          )}
          <div className={classes.subRow}>
            <Typography fontSize={14}>Always open</Typography>
            <Checkbox value={is24Hrs} onChange={() => setIs24Hrs(!is24Hrs)} />
          </div>
        </div>

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

export default AddVendorForm;

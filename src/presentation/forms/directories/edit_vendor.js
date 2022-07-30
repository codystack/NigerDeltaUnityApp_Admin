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
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { useHistory, useLocation } from "react-router-dom";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { Toolbar } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 256,
    height: 125,
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

const EditVendorForm = () => {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  let {
    id,
    name,
    logo,
    image,
    category,
    address,
    description,
    phone,
    website,
    opensAt,
    closesAt,
    is24hrs,
  } = location?.state;

  const [formValues, setFormValues] = React.useState({
    name: name,
    image: "",
    logo: "",
    category: category,
    address: address,
    description: description,
    phone: phone,
    website: website,
    opensAt: opensAt,
    closesAt: closesAt,
  });

  const [file, setFile] = React.useState(null);
  const [logoFile, setLogoFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewLogo, setPreviewLogo] = React.useState("");
  const [is24Hrs, setIs24Hrs] = React.useState(is24hrs);

  const { enqueueSnackbar } = useSnackbar();

  const [categoriesList, setCategoriesList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "categories"));
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

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "vendors/" + timeNow.getTime());
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
        enqueueSnackbar(`${error.message || ""}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "directories-vendors", "" + id);
          try {
            await updateDoc(mRef, {
              name: formValues.name,
              address: formValues.address,
              description: formValues.description,
              category: formValues.category,
              phone: formValues.phone,
              website: formValues.website,
              opensAt: formValues.opensAt,
              closesAt: formValues.closesAt,
              is24Hrs: is24Hrs,
              updatedAt: timeNow,
              image: downloadURL,
            });
            setIsLoading(false);
            enqueueSnackbar(`Vendor updated successfully`, {
              variant: "success",
            });
            history.goBack();
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(
              `${error?.message || "Check your internet connection!"}`,
              {
                variant: "error",
              }
            );
          }
        });
      }
    );
  };

  const uploadNewLogo = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "vendors/img_" + timeNow.getTime());
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
          const mRef = doc(db, "directories-vendors", "" + id);
          try {
            await updateDoc(mRef, {
              name: formValues.name,
              address: formValues.address,
              description: formValues.description,
              category: formValues.category,
              phone: formValues.phone,
              website: formValues.website,
              opensAt: formValues.opensAt,
              closesAt: formValues.closesAt,
              is24Hrs: is24Hrs,
              updatedAt: timeNow,
              logo: downloadURL,
            });
            setIsLoading(false);
            enqueueSnackbar(`Vendor updated successfully`, {
              variant: "success",
            });
            history.goBack();
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(`${error?.message || "Check your network"}`, {
              variant: "error",
            });
          }
        });
      }
    );
  };

  const updateVendor = async (e) => {
    setIsLoading(true);

    if (!previewImage && !previewLogo) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "directories-vendors", "" + id);
        await updateDoc(mRef, {
          name: formValues.name,
          address: formValues.address,
          description: formValues.description,
          category: formValues.category,
          phone: formValues.phone,
          website: formValues.website,
          opensAt: formValues.opensAt,
          closesAt: formValues.closesAt,
          is24Hrs: is24Hrs,
          updatedAt: timeNow,
        });
        setIsLoading(false);
        enqueueSnackbar(`Vendor updated successfully`, {
          variant: "success",
        });
        history.goBack();
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message || "Check internet connection"}`, {
          variant: "error",
        });
      }
    } else if (previewImage && !previewLogo) {
      //Change on the featured image and all texts
      const fileRef = ref(storage, "vendors/" + id);

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewImage();
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else if (!previewImage && previewLogo) {
      //Change on the featured image and all texts
      const fileRef = ref(storage, "vendors/img_" + id);

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewLogo();
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else {
      const fileRef = ref(storage, "vendors/" + id);
      const fileRef2 = ref(storage, "vendors/img_" + id);

      setIsLoading(true);

      deleteObject(fileRef)
        .then(() => {
          //Now Delete authors photo
          deleteObject(fileRef2)
            .then(() => {
              //Both items were deleted
              const timeNow = new Date();
              let storageRef = ref(storage, "vendors/" + timeNow.getTime());
              let storageRef2 = ref(
                storage,
                "vendors/img_" + timeNow.getTime()
              );
              let uploadTask = uploadBytesResumable(storageRef, file);
              let uploadTask2 = uploadBytesResumable(storageRef2, logoFile);

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
                  enqueueSnackbar(`${error?.message || "Check your network"}`, {
                    variant: "error",
                  });
                },
                () => {
                  getDownloadURL(uploadTask?.snapshot?.ref).then(
                    async (downloadURL) => {
                      try {
                        const mRef = doc(db, "directories-vendors", "" + id);
                        await updateDoc(mRef, {
                          name: formValues.name,
                          address: formValues.address,
                          description: formValues.description,
                          category: formValues.category,
                          phone: formValues.phone,
                          website: formValues.website,
                          opensAt: formValues.opensAt,
                          closesAt: formValues.closesAt,
                          is24Hrs: is24Hrs,
                          updatedAt: timeNow,
                          image: downloadURL,
                        });
                        const tmn = timeNow.getTime();
                        setIsUploading(true);
                        setIsLoading(false);
                        uploadTask2.on(
                          "state_changed",
                          (snapshot2) => {
                            const prog =
                              (snapshot2.bytesTransferred /
                                snapshot2.totalBytes) *
                              100;
                            setProgress(prog);
                          },
                          (error) => {
                            setIsUploading(false);
                            console.log(error);
                            enqueueSnackbar(`${error?.message || ""}`, {
                              variant: "error",
                            });
                          },
                          () => {
                            getDownloadURL(uploadTask2?.snapshot?.ref).then(
                              async (download) => {
                                setIsUploading(false);
                                setIsLoading(true);
                                try {
                                  const mRef = doc(
                                    db,
                                    "directories-vendors",
                                    "" + tmn
                                  );
                                  await updateDoc(mRef, {
                                    logo: download,
                                  });
                                  setIsLoading(false);
                                  enqueueSnackbar(
                                    `Vendor updated successfully`,
                                    {
                                      variant: "success",
                                    }
                                  );
                                  history.goBack();
                                } catch (error) {
                                  setIsLoading(false);
                                  enqueueSnackbar(
                                    `${
                                      error?.message ||
                                      "Check your internet connection"
                                    }`,
                                    {
                                      variant: "error",
                                    }
                                  );
                                }
                              }
                            );
                          }
                        );
                      } catch (error) {
                        setIsLoading(false);
                        enqueueSnackbar(
                          `${error?.message || "Check your internet"}`,
                          {
                            variant: "error",
                          }
                        );
                      }
                    }
                  );
                }
              );
            })
            .catch((error) => {
              setIsLoading(false);
              enqueueSnackbar(
                `${error?.message || "Check your internet connection!"}`,
                {
                  variant: "error",
                }
              );
            });
        })
        .catch((error) => {
          setIsLoading(false);
          enqueueSnackbar(
            `${error?.message || "Check your internet connection!"}`,
            {
              variant: "error",
            }
          );
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
      <ValidatorForm onSubmit={updateVendor}>
        <Box
          width={"100%"}
          display="flex"
          flexDirection="row"
          justifyContent="start"
          alignItems={"start"}
          paddingBottom={2}
        >
          <Button
            disableElevation
            variant="text"
            startIcon={<ArrowBackIosNew />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography px={4} variant="h6">
            Update Vendor
          </Typography>
        </Box>

        <Grid
          container
          spacing={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
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
              helperText="Featured image"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                variant="rounded"
                alt="Passport"
                src={previewImage ? previewImage : image}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={6} md={7}>
            <TextValidator
              id="logo"
              size="small"
              variant="outlined"
              value={formValues.logo}
              name="logo"
              type="file"
              fullWidth
              disabled={isLoading}
              accept=".png, .jpg, .jpeg"
              onChange={handleChange}
              helperText="Vendor's logo"
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              variant="circular"
              alt="Passport"
              sx={{ width: 72, height: 72 }}
              src={previewLogo ? previewLogo : logo}
              // className={classes.image}
            />
          </Grid>
        </Grid>

        <Toolbar />

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
            <Checkbox checked={is24Hrs} onChange={() => setIs24Hrs(!is24Hrs)} />
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

export default EditVendorForm;

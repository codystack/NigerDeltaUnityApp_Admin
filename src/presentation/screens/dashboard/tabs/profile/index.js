import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/system/Box";
import {
  db,
  doc,
  ref,
  auth,
  storage,
  uploadBytesResumable,
  updateDoc,
  getDownloadURL,
  updatePassword,
} from "../../../../../data/firebase";
import Edit from "@mui/icons-material/Edit";

import CustomDialogFN from "../../../../components/dashboard/dialogs/custom-dialog";
import CustomDialogLN from "../../../../components/dashboard/dialogs/custom-dialog";
import CustomDialogNUM from "../../../../components/dashboard/dialogs/custom-dialog";
import CustomDialogPass from "../../../../components/dashboard/dialogs/custom-dialog";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { setUserData } from "../../../../../data/store/slice/user";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {},
  divRoot: {
    display: "flex",
    padding: theme.spacing(3),
    flexDirection: "column",
    alignItems: "center",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "primary",
    borderWidth: 3,
    borderStyle: "solid",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
  progress: {
    color: "white",
    zIndex: 500,
    margin: "auto",
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

const Profile = () => {
  const classes = useStyles();
  const { userData } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const fileInputRef = React.useRef();
  const { enqueueSnackbar } = useSnackbar();

  const [openFN, setOpenFN] = React.useState(false);
  const [openLN, setOpenLN] = React.useState(false);
  const [openNum, setOpenNum] = React.useState(false);
  const [openPass, setOpenPass] = React.useState(false);

  const initials =
    userData?.firstname?.slice(0, 1).toUpperCase() +
    userData?.lastname?.slice(0, 1).toUpperCase();

  let imgSize;
  const theme = useTheme();
  const xsmall = useMediaQuery(theme.breakpoints.only("xs"));
  const small = useMediaQuery(theme.breakpoints.only("sm"));
  const medium = useMediaQuery(theme.breakpoints.only("md"));
  const others = useMediaQuery(theme.breakpoints.up("lg"));

  if (xsmall) {
    imgSize = 150;
  } else if (small) {
    imgSize = 174;
  } else if (medium) {
    imgSize = 200;
  } else if (others) {
    imgSize = 236;
  }

  const handleFile = (e) => {
    try {
      if (e?.target?.files[0]) {
        setImageFile(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
      }
    } catch (e) {}
  };

  const performSubmit = (e) => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(
      storage,
      "users-" + userData?.id + "/" + timeNow.getTime()
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uprogress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uprogress);
      },
      (error) => {
        // Handle unsuccessful uploads
        setIsUploading(false);
        enqueueSnackbar(
          `${error?.message} || "Check your internet connection"`,
          { variant: "error" }
        );
      },
      () => {
        setIsUploading(false);
        setLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "users", "" + userData?.id);
          try {
            await updateDoc(mRef, {
              image: downloadURL,
            });
            setLoading(false);
            setImageUrl(null);
            setImageFile(null);
            enqueueSnackbar(`Image updated successfully`, {
              variant: "success",
            });
          } catch (error) {
            setLoading(false);
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

  return (
    <div>
      <CustomDialogFN
        open={openFN}
        title="Update My Firstname"
        handleClose={() => setOpenFN(false)}
        bodyComponent={
          <UpdateFN
            setOpen={setOpenFN}
            userId={userData?.id}
            firstname={userData?.firstname}
          />
        }
      />

      <CustomDialogLN
        open={openLN}
        title="Update My Lastname"
        handleClose={() => setOpenLN(false)}
        bodyComponent={
          <UpdateLN
            setOpen={setOpenLN}
            userId={userData?.id}
            lastname={userData?.lastname}
          />
        }
      />

      <CustomDialogNUM
        open={openNum}
        title="Update My Phone number"
        handleClose={() => setOpenNum(false)}
        bodyComponent={
          <UpdatePhone
            setOpen={setOpenNum}
            userId={userData?.id}
            phone={userData?.phone}
          />
        }
      />

      <CustomDialogPass
        open={openPass}
        title="Update My Password"
        handleClose={() => setOpenPass(false)}
        bodyComponent={
          <UpdatePassword
            setOpen={setOpenPass}
            userId={userData?.id}
            oldPassword={userData?.password}
          />
        }
      />

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
      <Typography variant="h6" fontWeight="600" gutterBottom={true}>
        Personal Account Information
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Grid item sm={6} md={6}>
            <div className={classes.divRoot}>
              <div
                className={classes.avatarContainer}
                style={{
                  width: imgSize + 3,
                  height: imgSize + 3,
                  borderRadius: (imgSize + 3) / 2,
                }}
              >
                <Avatar
                  src={
                    imageUrl
                      ? imageUrl
                      : userData?.image !== ""
                      ? userData?.image
                      : ""
                  }
                  style={{
                    width: imgSize - 12,
                    height: imgSize - 12,
                    borderRadius: (imgSize - 12) / 2,
                    fontSize: 64,
                  }}
                >
                  {userData?.image !== "" ? "" : initials}
                </Avatar>
              </div>
              <br />
              <input
                hidden={true}
                ref={fileInputRef}
                type="file"
                onChange={handleFile}
              />

              <div className={classes.buttonRow}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  disableElevation={true}
                  sx={{
                    backgroundColor: "primary.main",
                    textTransform: "none",
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Profile
                </Button>

                <Button
                  hidden={imageFile ? false : true}
                  disabled={isLoading || isUploading}
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  disableElevation={true}
                  onClick={performSubmit}
                  sx={{ textTransform: "none" }}
                >
                  Save
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item sm={6} md={6} alignItems={"center"}>
            <Box
              paddingY={1}
              display="flex"
              flexDirection="row"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent={"start"}
                alignItems="center"
              >
                <Typography>FIRSTNAME</Typography>
                <Typography variant="h6" pl={2}>
                  {userData?.firstname}
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenFN(true)}>
                <Edit />
              </IconButton>
            </Box>
            <Divider />
            <Box
              paddingY={1}
              display="flex"
              flexDirection="row"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent={"start"}
                alignItems="center"
              >
                <Typography>LASTNAME</Typography>
                <Typography variant="h6" pl={2}>
                  {userData?.lastname}
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenLN(true)}>
                <Edit />
              </IconButton>
            </Box>
            <Divider />
            <Box
              paddingY={1}
              display="flex"
              flexDirection="row"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent={"start"}
                alignItems="center"
              >
                <Typography>PHONE NUMBER</Typography>
                <Typography variant="h6" pl={2}>
                  {userData?.phone}
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenNum(true)}>
                <Edit />
              </IconButton>
            </Box>
            <Divider />
            <Box
              paddingTop={5}
              display="flex"
              flexDirection="row"
              justifyContent={"stretch"}
              alignItems="center"
            >
              <Button
                variant="contained"
                fullWidth
                disableElevation={true}
                sx={{ textTransform: "none" }}
                onClick={() => setOpenPass(true)}
              >
                Update Password{" "}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const UpdateFN = (props) => {
  let { firstname, setOpen, userId } = props;
  const [formValues, setFormValues] = React.useState({
    firstname: firstname,
  });
  const [isLoading, setLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateData = async (e) => {
    setLoading(true);

    try {
      const mRef = doc(db, "users", "" + userId);
      await updateDoc(mRef, {
        firstname: formValues.firstname,
      });
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`First name updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
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
      <ValidatorForm onSubmit={updateData}>
        <TextValidator
          label="First Name"
          size="small"
          variant="outlined"
          value={formValues.firstname}
          onChange={handleChange}
          name="firstname"
          fullWidth
          validators={["required"]}
          errorMessages={["First name is required"]}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Firstname
        </Button>
      </ValidatorForm>
    </div>
  );
};

const UpdateLN = (props) => {
  let { lastname, setOpen, userId } = props;
  const [formValues, setFormValues] = React.useState({
    lastname: lastname,
  });
  const [isLoading, setLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateData = async (e) => {
    setLoading(true);

    try {
      const mRef = doc(db, "users", "" + userId);
      await updateDoc(mRef, {
        lastname: formValues.lastname,
      });
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`Last name updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
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
      <ValidatorForm onSubmit={updateData}>
        <TextValidator
          label="last Name"
          size="small"
          variant="outlined"
          value={formValues.lastname}
          onChange={handleChange}
          name="lastname"
          fullWidth
          validators={["required"]}
          errorMessages={["Last name is required"]}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Lastname
        </Button>
      </ValidatorForm>
    </div>
  );
};

const UpdatePhone = (props) => {
  let { phone, setOpen, userId } = props;
  const [formValues, setFormValues] = React.useState({
    phone: phone,
  });
  const [isLoading, setLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateData = async (e) => {
    setLoading(true);

    try {
      const mRef = doc(db, "users", "" + userId);
      await updateDoc(mRef, {
        phone: formValues.phone,
      });
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`Phone number updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
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
      <ValidatorForm onSubmit={updateData}>
        <TextValidator
          label="Phone Number"
          size="small"
          variant="outlined"
          value={formValues.phone}
          onChange={handleChange}
          name="phone"
          fullWidth
          validators={["required"]}
          errorMessages={["Phone number is required"]}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Phone Number
        </Button>
      </ValidatorForm>
    </div>
  );
};

const UpdatePassword = (props) => {
  let { oldPassword, setOpen, userId } = props;
  const [formValues, setFormValues] = React.useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showCode, setShowCode] = React.useState(false);
  const [showCode2, setShowCode2] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [isError, setError] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const dispatch = useDispatch();

  const user = auth.currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
    if (oldPassword !== formValues.oldPassword) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const updateData = (e) => {
    setLoading(true);

    if (formValues.oldPassword === oldPassword) {
      setError(false);
      updatePassword(user, formValues.newPassword)
        .then(async () => {
          // Update successful.
          try {
            const mRef = doc(db, "users", "" + userId);
            await updateDoc(mRef, {
              password: formValues.newPassword,
            });
            setOpen(false);
            setLoading(false);
            await auth.signOut();
            dispatch(setUserData(null));
            enqueueSnackbar(`Successfully logged out`, { variant: "success" });
            history.replace({
              pathname: "/",
            });
            enqueueSnackbar(`Password updated successfully`, {
              variant: "success",
            });
          } catch (error) {
            setLoading(false);
            enqueueSnackbar(
              `${error?.message || "Check your internet connection"}`,
              {
                variant: "error",
              }
            );
          }
        })
        .catch((error) => {
          // An error ocurred
          setLoading(false);
          enqueueSnackbar(
            `${error?.message || "Check your internet connection"}`,
            {
              variant: "error",
            }
          );
        });
    } else {
      setError(true);
      setLoading(false);
      enqueueSnackbar(`${"Incorrect Old Password!"}`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
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
      <ValidatorForm onSubmit={updateData}>
        <TextValidator
          margin="normal"
          required
          fullWidth
          name="oldPassword"
          label="Old Password"
          type={showCode ? "text" : "password"}
          onChange={handleChange}
          value={formValues.oldPassword}
          placeholder="Old Password"
          variant="outlined"
          style={{ borderColor: isError ? "red" : "inherit", borderWidth: 1 }}
          validators={["required"]}
          errorMessages={["Old Password is required"]}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle code"
                  onClick={() => setShowCode(!showCode)}
                  onMouseDown={() => setShowCode(!showCode)}
                  edge="end"
                >
                  {showCode ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <br />
        <TextValidator
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="New Password"
          type={showCode2 ? "text" : "password"}
          onChange={handleChange}
          value={formValues.newPassword}
          placeholder="New Password"
          variant="outlined"
          validators={["required"]}
          errorMessages={["New Password is required"]}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle code"
                  onClick={() => setShowCode2(!showCode2)}
                  onMouseDown={() => setShowCode2(!showCode2)}
                  edge="end"
                >
                  {showCode2 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Password
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default Profile;

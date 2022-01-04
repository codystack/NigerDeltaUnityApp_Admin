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
  query,
  onSnapshot,
  collection,
  updateDoc,
  arrayUnion,
  uploadBytesResumable,
  getDownloadURL,
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, Grid, MenuItem } from "@mui/material";
import { Typography } from "@mui/material";
import Dropzone from "react-dropzone";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 120,
    height: 100,
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

const AddProjectForm = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
    image: "",
    state: "",
    desc: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const [statesList, setStatesList] = React.useState(null);
  const [stateId, setStateId] = React.useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const [files, setFiles] = React.useState([]);
  const [fileNames, setFileNames] = React.useState([]);
  const [urls, setUrls] = React.useState([]);
  // const [fileError, setFileError] = React.useState("");

  const handleDrop = (acceptedFiles) => {
    setFileNames(acceptedFiles.map((file) => file.name));
    setFiles(acceptedFiles);
  };

  React.useEffect(() => {
    const q = query(collection(db, "states"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const states = [];
      querySnapshot.forEach((doc) => {
        states.push(doc.data());
      });
      setStatesList(states);
    });
  }, []);

  const fileValidator = (file) => {
    if (!file || file?.length < 1) {
      return {
        code: "name-too-large",
        message: `You must select at least one file!`,
      };
    }
    return null;
  };

  const handleChange = async (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else if (name === "state") {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
      let item = await statesList?.find((item) => item?.name === value);
      setStateId(item?.id);
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleUpload = (tnw) => {
    const promises = [];
    files?.map((image) => {
      let storageRef = ref(storage, `projects/${image.name}`);
      let uploadTask = uploadBytesResumable(storageRef, files);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsUploading(false);
            setIsLoading(true);
            setUrls(urls.push(downloadURL));
          });
        }
      );
    });

    Promise.all(promises)
      .then(async () => {
        // Now update the images field
        console.log("URLS", urls);
        try {
          const mRef = doc(db, "projects", "" + tnw);
          await updateDoc(mRef, {
            images: arrayUnion(...urls),
          });

          setOpen(false);
          setIsLoading(false);
          enqueueSnackbar(`New project added successfully`, {
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
      })
      .catch((err) => console.log(err));
  };

  const createProject = (e) => {
    setIsUploading(true);
    //First upload images to firebase storage then save to firestore
    const timeNow = new Date();

    let storageRef = ref(storage, "projects/" + timeNow.getTime());
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
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setIsUploading(false);
            setIsLoading(true);
            setDoc(doc(db, "projects", `${timeNow.getTime()}`), {
              id: timeNow.getTime(),
              title: formValues.title,
              image: downloadURL,
              images: [],
              state: formValues.state,
              stateId: stateId,
              description: formValues.desc,
              createdAt: timeNow,
              updatedAt: timeNow,
            })
              .then((res) => {
                //Now upload project progress images here
                handleUpload(timeNow.getTime());
              })
              .catch((error) => {
                setIsUploading(false);
                setIsLoading(false);
                enqueueSnackbar(`${error?.message}`, {
                  variant: "error",
                });
              });
          })
          .catch((error) => {
            setIsUploading(false);
            setIsLoading(false);
            enqueueSnackbar(`${error?.message}`, {
              variant: "error",
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
      <ValidatorForm onSubmit={createProject}>
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
              errorMessages={["Featured image is required"]}
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

        <SelectValidator
          id="state"
          className={classes.mb}
          value={formValues.state}
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
            <MenuItem key={index} value={item?.name ?? ""}>
              {item?.name ?? ""}
            </MenuItem>
          ))}
        </SelectValidator>

        <TextValidator
          className={classes.mb}
          id="title"
          label="Project title"
          size="small"
          variant="outlined"
          value={formValues.title}
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
          placeholder="Project description here"
          name="desc"
          label="Project description"
          value={formValues.desc}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Project description is required"]}
        />

        <Dropzone
          onDrop={handleDrop}
          validator={fileValidator}
          accept={
            "image/png, image/jpg, image/jpeg, application/pdf, application/mspowerpoint, application/powerpoint, application/vnd.ms-powerpoint, application/x-mspowerpoint"
          }
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: classes.dropZone })}>
              <input {...getInputProps()} />
              {files?.length > 0 ? (
                <div className={classes.row}>
                  <div>
                    <List disablePadding>
                      {fileNames.map((fileName) => (
                        <ListItem disableGutters divider key={fileName}>
                          {fileName}
                        </ListItem>
                      ))}
                    </List>
                  </div>
                  <Typography padding={2} color="blue">
                    Add more files
                  </Typography>
                </div>
              ) : (
                <p>Add project images, Maximum of 5 images</p>
              )}
            </div>
          )}
        </Dropzone>

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Create Project
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default AddProjectForm;

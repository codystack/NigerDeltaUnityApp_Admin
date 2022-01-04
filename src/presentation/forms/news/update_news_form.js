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
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { MenuItem } from "@mui/material";
import RichText from "../../components/misc/richtext/";

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

const EditNewsForm = (props) => {
  const classes = useStyles();
  let {
    setOpen,
    id,
    title,
    img,
    category,
    body,
    summary,
    authorName,
    authorPhoto,
  } = props;
  const [formValues, setFormValues] = React.useState({
    title: title,
    image: "",
    category: category,
    authorName: authorName,
    authorPhoto: "",
    summary: summary,
  });
  const [file, setFile] = React.useState(null);
  const [authorFile, setAuthorFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewAuthor, setPreviewAuthor] = React.useState("");

  const [newsBody, setNewsBody] = React.useState(body);
  const [isError, setIsError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [categoriesList, setCategoriesList] = React.useState(null);
  const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  React.useEffect(() => {
    const q = query(collection(db, "categories"));
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
    } else if (id === "authorPhoto") {
      setAuthorFile(e.target.files[0]);
      setPreviewAuthor(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        authorPhoto: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "news/" + timeNow.getTime());
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
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "news", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              authorName: formValues.authorName,
              category: formValues.category,
              body: newsBody,
              summary: formValues.summary,
              updatedAt: timeNow,
              image: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Newsfeed updated successfully`, {
              variant: "success",
            });
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(`${error?.message}`, {
              variant: "error",
            });
          }
        });
      }
    );
  };

  const uploadNewAuthorPhoto = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "news/img_" + timeNow.getTime());
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
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "news", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              authorName: formValues.authorName,
              category: formValues.category,
              body: newsBody,
              summary: formValues.summary,
              updatedAt: timeNow,
              authorPhoto: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Newsfeed updated successfully`, {
              variant: "success",
            });
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(`${error?.message}`, {
              variant: "error",
            });
          }
        });
      }
    );
  };

  const updateNews = async (e) => {
    setIsLoading(true);
    setFormValues({
      title: formValues.title ? formValues.title : title,
      authorName: formValues.authorName ? formValues.authorName : authorName,
      category: formValues.category ? formValues.category : category,
      body: newsBody,
      summary: formValues.summary ? formValues.summary : summary,
    });
    if (!previewImage && !previewAuthor) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "news", "" + id);
        await updateDoc(mRef, {
          title: formValues.title,
          authorName: formValues.authorName,
          category: formValues.category,
          body: newsBody,
          summary: formValues.summary,
          updatedAt: timeNow,
        });
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`News title updated successfully`, {
          variant: "success",
        });
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message}`, {
          variant: "error",
        });
      }
    } else if (previewImage && !previewAuthor) {
      //Change on the featured image and all texts
      const fileRef = ref(storage, "news/" + id);

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewImage();
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("ErR: ", error);
        });
    } else if (!previewImage && previewAuthor) {
      //Change on the featured image and all texts
      const fileRef = ref(storage, "news/img_" + id);

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewAuthorPhoto();
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("ErR: ", error);
        });
    } else {
      const fileRef = ref(storage, "news/" + id);
      const fileRef2 = ref(storage, "news/img_" + id);

      setIsLoading(true);

      deleteObject(fileRef)
        .then(() => {
          //Now Delete authors photo
          deleteObject(fileRef2)
            .then(() => {
              //Both items were deleted
              const timeNow = new Date();
              let storageRef = ref(storage, "news/" + timeNow.getTime());
              let storageRef2 = ref(storage, "news/img_" + timeNow.getTime());
              let uploadTask = uploadBytesResumable(storageRef, file);
              let uploadTask2 = uploadBytesResumable(storageRef2, authorFile);

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
                  console.log(error);
                  enqueueSnackbar(`${error?.message}`, { variant: "error" });
                },
                () => {
                  getDownloadURL(uploadTask?.snapshot?.ref).then(
                    async (downloadURL) => {
                      try {
                        const mRef = doc(db, "news", "" + id);
                        await updateDoc(mRef, {
                          title: formValues.title,
                          authorName: formValues.authorName,
                          category: formValues.category,
                          body: newsBody,
                          summary: formValues.summary,
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
                            enqueueSnackbar(`${error?.message}`, {
                              variant: "error",
                            });
                          },
                          () => {
                            getDownloadURL(uploadTask2?.snapshot?.ref).then(
                              async (download) => {
                                setIsUploading(false);
                                setIsLoading(true);
                                try {
                                  const mRef = doc(db, "news", "" + tmn);
                                  await updateDoc(mRef, {
                                    authorPhoto: download,
                                  });
                                  setOpen(false);
                                  setIsLoading(false);
                                  enqueueSnackbar(
                                    `Newsfeed updated successfully`,
                                    {
                                      variant: "success",
                                    }
                                  );
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
                      } catch (error) {}
                    }
                  );
                }
              );
            })
            .catch((err) => {});
          // setIsLoading(false);
          // uploadNewAuthorPhoto();
        })
        .catch((error) => {
          setIsLoading(false);
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
      <ValidatorForm onSubmit={updateNews}>
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
              helperText="Featured image"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                variant="rounded"
                alt="Passport"
                src={previewImage ? previewImage : img}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>
        <SelectValidator
          className={classes.mb}
          value={formValues.category ? formValues.category : category}
          onChange={handleChange}
          label="News category"
          name="category"
          fullWidth
          variant="outlined"
          size="small"
          validators={["required"]}
          errorMessages={["News category is required"]}
        >
          {(categoriesList ?? [])?.map((item, index) => (
            <MenuItem key={index} value={item?.title ?? ""}>
              {item?.title ?? ""}
            </MenuItem>
          ))}
        </SelectValidator>
        <TextValidator
          className={classes.mb}
          id="title"
          label="News title"
          size="small"
          variant="outlined"
          value={
            formValues.title === " "
              ? title
              : !formValues.title
              ? ""
              : formValues.title
          }
          onChange={handleChange}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["News title is required"]}
        />
        <RichText
          value={newsBody}
          setValue={setNewsBody}
          error={isError}
          setError={setIsError}
          setIsStartedFilling={setIsStartedFilling}
        />
        <br />
        <TextValidator
          className={classes.mb}
          id="summary"
          multiLine
          rows={2}
          rowsMax={2}
          label="News summary"
          placeholder="Type summary here..."
          size="small"
          variant="outlined"
          value={formValues.summary}
          onChange={handleChange}
          name="summary"
          fullWidth
          validators={["required"]}
          errorMessages={["News summary is required"]}
        />
        <Grid container spacing={1} padding={1} marginBottom={1}>
          <Grid item xs={12} sm={6} md={7}>
            <div>
              <TextValidator
                className={classes.mb}
                id="authorPhoto"
                size="small"
                variant="outlined"
                name="authorPhoto"
                type="file"
                fullWidth
                disabled={isLoading}
                accept=".png, .jpg, .jpeg,"
                onChange={handleChange}
                helperText="Author's photograph"
              />
              <TextValidator
                className={classes.mb}
                id="authorName"
                label="Author's name"
                size="small"
                variant="outlined"
                value={
                  formValues.authorName === " "
                    ? authorName
                    : !formValues.authorName
                    ? ""
                    : formValues.authorName
                }
                onChange={handleChange}
                name="authorName"
                fullWidth
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                alt="Author"
                src={previewAuthor ? previewAuthor : authorPhoto}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Update
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default EditNewsForm;

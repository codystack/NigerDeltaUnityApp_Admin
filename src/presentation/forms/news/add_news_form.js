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

const AddNewsForm = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
    image: "",
    category: "",
    subTitle: " ",
    body: "",
    createdAt: "",
    authorName: "",
    authorPhoto: "",
  });
  const [file, setFile] = React.useState(null);
  const [authorFile, setAuthorFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewAuthor, setPreviewAuthor] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [categoriesList, setCategoriesList] = React.useState(null);

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

  const createNews = (e) => {
    setIsUploading(true);

    //First upload images to firebase storage then save to firestore
    const timeNow = new Date();
    let storageRef = ref(storage, "news/" + timeNow.getTime());
    let storageRef2 = ref(storage, "news/img_" + timeNow.getTime());
    let uploadTask = uploadBytesResumable(storageRef, file);
    let uploadTask2 = uploadBytesResumable(storageRef2, authorFile);
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
          setDoc(doc(db, "news", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            title: formValues.title,
            image: downloadURL,
            category: formValues.category,
            subTitle: formValues.subTitle,
            authorName: formValues.authorName,
            authorPhoto: " ",
            body: formValues.body,
            createdAt: timeNow,
            updatedAt: timeNow,
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
                        const mRef = doc(db, "news", "" + tmn);
                        await updateDoc(mRef, {
                          authorPhoto: download,
                        });
                        setOpen(false);
                        setIsLoading(false);
                        enqueueSnackbar(`News item added successfully`, {
                          variant: "success",
                        });
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
              accept=".png, .jpg, .jpeg, .pdf"
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
          className={classes.mb}
          value={formValues.category}
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
          value={formValues.title}
          onChange={handleChange}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["News title is required"]}
        />

        <TextValidator
          className={classes.mb}
          id="subTitle"
          label="News subtitle (optional)"
          size="small"
          variant="outlined"
          value={formValues.subTitle}
          onChange={handleChange}
          name="subTitle"
          fullWidth
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          multiline
          rows={5}
          rowsMax={10}
          placeholder="Type news here"
          name="body"
          label="News content"
          value={formValues.body}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["News content is required"]}
        />

        <Grid container spacing={1} padding={1} marginBottom={1}>
          <Grid item xs={12} sm={6} md={7}>
            <div>
              <TextValidator
                className={classes.mb}
                id="authorPhoto"
                size="small"
                variant="outlined"
                value={formValues.authorPhoto}
                name="authorPhoto"
                type="file"
                fullWidth
                disabled={isLoading}
                accept=".png, .jpg, .jpeg,"
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Author's image is required"]}
                helperText="Author's photograph"
              />
              <TextValidator
                className={classes.mb}
                id="authorName"
                label="Author's name"
                size="small"
                variant="outlined"
                value={formValues.authorName}
                onChange={handleChange}
                name="authorName"
                fullWidth
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              {previewAuthor && (
                <Avatar
                  alt="Author"
                  src={previewAuthor}
                  className={classes.image}
                />
              )}
            </div>
          </Grid>
        </Grid>

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

export default AddNewsForm;

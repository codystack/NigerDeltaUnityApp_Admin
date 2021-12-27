import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { db, doc, updateDoc } from "../../../data/firebase/";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 128,
    height: 128,
  },
  mb: {
    marginBottom: 10,
  },
}));

// const CircularProgressWithLabel = (props) => {
//   return (
//     <Box position="relative" display="inline-flex">
//       <CircularProgress
//         variant="determinate"
//         {...props}
//         size={90}
//         thickness={3.0}
//         style={{ color: "green" }}
//       />
//       <Box
//         top={0}
//         left={0}
//         bottom={0}
//         right={0}
//         position="absolute"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Typography
//           variant="body1"
//           component="div"
//           style={{ color: "white", fontFamily: "roboto" }}
//         >{`${Math.round(props.value)}%`}</Typography>
//       </Box>
//     </Box>
//   );
// };

const UpdateContactUsForm = (props) => {
  const classes = useStyles();
  let { setOpen, img, phone, email, website, facebook, instagram } = props;
  const [formValues, setFormValues] = React.useState({
    phone: " ",
    email: " ",
    website: " ",
    facebook: " ",
    instagram: " ",
    image: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  //   const [progress, setProgress] = React.useState(0);
  const [previewPassport, setPreviewPassport] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      setPreviewPassport(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  //   const uploadNew = (e) => {
  //     setIsUploading(true);
  //     const timeNow = new Date();
  //     //First upload image to firebase storage then save to firestore
  //     const storageRef = ref(storage, "categories/img_" + timeNow.getTime());
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const uprogress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setProgress(uprogress);
  //       },
  //       (error) => {
  //         setIsUploading(false);
  //         console.log(error);
  //         enqueueSnackbar(`${error.message}`, { variant: "error" });
  //       },
  //       () => {
  //         setIsUploading(false);
  //         setIsLoading(true);
  //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
  //           const mRef = doc(db, "categories", "img_" + id);
  //           try {
  //             await updateDoc(mRef, {
  //               title: formValues.title,
  //               url: downloadURL,
  //             });
  //             setOpen(false);
  //             setIsLoading(false);
  //             enqueueSnackbar(`Category updated successfully`, {
  //               variant: "success",
  //             });
  //           } catch (error) {
  //             setIsLoading(false);
  //             enqueueSnackbar(`Error updating category`, {
  //               variant: "error",
  //             });
  //           }
  //         });
  //       }
  //     );
  //   };

  const updateContactInfo = async (e) => {
    setIsLoading(true);
    // setFormValues({
    //   phone: formValues.phone === " " ? phone : formValues.phone,
    //   email: formValues.email === " " ? email : formValues.email,
    //   website: formValues.website === " " ? website : formValues.website,
    //   facebook: formValues.facebook === " " ? facebook : formValues.facebook,
    //   instagram:
    //     formValues.instagram === " " ? instagram : formValues.instagram,
    // });
    // if (!previewPassport) {
    //   console.log("ID: ", id);
    const timeNow = new Date();
    const mRef = doc(db, "others", "contact-us");
    try {
      await updateDoc(mRef, {
        phone: formValues.phone === " " ? phone : formValues.phone,
        email: formValues.email === " " ? email : formValues.email,
        website: formValues.website === " " ? website : formValues.website,
        facebook: formValues.facebook === " " ? facebook : formValues.facebook,
        instagram:
          formValues.instagram === " " ? instagram : formValues.instagram,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Contact info updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Error updating Ccntact info"}`, {
        variant: "error",
      });
    }
    // }
    // else {
    //   setFormValues({ title: formValues.title ? formValues.title : name });
    //   const fileRef = ref(storage, "categories/img_" + id);

    //   deleteObject(fileRef)
    //     .then(() => {
    //       // File deleted now upload new file,
    //       //get download url and save to firestore
    //       setIsLoading(false);
    //       uploadNew();
    //     })
    //     .catch((error) => {
    //       setIsLoading(false);
    //       console.log("ErR: ", error);
    //     });
    // }
  };

  return (
    <div style={{ width: 512 }}>
      <Backdrop style={{ zIndex: 1200 }} open={isUploading || isLoading}>
        {/* {isUploading ? <CircularProgressWithLabel value={progress} /> : <div />} */}
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
      <ValidatorForm onSubmit={updateContactInfo}>
        <TextValidator
          className={classes.mb}
          fullWidth
          name="phone"
          label="Phone"
          value={
            formValues.phone === " "
              ? phone
              : !formValues.phone
              ? ""
              : formValues.phone
          }
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Phone number is required"]}
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          name="email"
          label="Email address"
          value={
            formValues.email === " "
              ? email
              : !formValues.email
              ? ""
              : formValues.email
          }
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Email address is required"]}
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          name="website"
          label="Website"
          value={
            formValues.website === " "
              ? website
              : !formValues.website
              ? ""
              : formValues.website
          }
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Website is required"]}
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          name="facebook"
          label="Facebook"
          value={
            formValues.facebook === " "
              ? facebook
              : !formValues.facebook
              ? ""
              : formValues.facebook
          }
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Facebook is required"]}
        />

        <TextValidator
          className={classes.mb}
          fullWidth
          name="instagram"
          label="Instagram"
          value={
            formValues.instagram === " "
              ? instagram
              : !formValues.instagram
              ? ""
              : formValues.instagram
          }
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Instagram is required"]}
        />

        {/* <br />
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
          //   validators={["required"]}
          //   errorMessages={["Category image is required"]}
          helperText="Upload category image"
        /> */}

        {/* <div>
          <Avatar
            variant="rounded"
            alt="Passport"
            src={previewPassport ? previewPassport : img}
            className={classes.image}
          />
        </div> */}
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

export default UpdateContactUsForm;

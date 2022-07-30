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
  let { setOpen, phone, email, website, facebook, instagram } = props;
  const [formValues, setFormValues] = React.useState({
    phone: phone,
    email: email,
    website: website,
    facebook: facebook,
    instagram: instagram,
    image: "",
  });
  // const [file, setFile] = React.useState(null);
  // const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  //   const [progress, setProgress] = React.useState(0);
  // const [previewPassport, setPreviewPassport] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const updateContactInfo = async (e) => {
    setIsLoading(true);

    const timeNow = new Date();
    const mRef = doc(db, "others", "contact-us");
    try {
      await updateDoc(mRef, {
        phone: formValues.phone,
        email: formValues.email,
        website: formValues.website,
        facebook: formValues.facebook,
        instagram: formValues.instagram,
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
  };

  return (
    <div style={{ width: 512 }}>
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
      <ValidatorForm onSubmit={updateContactInfo}>
        <TextValidator
          className={classes.mb}
          fullWidth
          name="phone"
          label="Phone"
          value={formValues.phone}
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
          value={formValues.email}
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
          value={formValues.website}
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
          value={formValues.facebook}
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
          value={formValues.instagram}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Instagram is required"]}
        />

        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Save
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdateContactUsForm;

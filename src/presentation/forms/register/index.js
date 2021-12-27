import React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createUser } from "../../../domain/service";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  db,
  doc,
  getDoc,
  setDoc,
  setPersistence,
  browserSessionPersistence,
  auth,
} from "../../../data/firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../data/store/slice/user";
import { useHistory } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const SignupForm = () => {
  const [formValues, setFormValues] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showCode, setShowCode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = (e) => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        createUser(formValues.email, formValues.password)
          .then(async (resp) => {
            try {
              setDoc(doc(db, "users", resp.user.uid), {
                id: resp.user.uid,
                firstname: formValues.firstName,
                lastname: formValues.lastName,
                phone: formValues.phone,
                email: formValues.email,
                userType: "super",
              })
                .then(async (result) => {
                  //Fetch user data and save to redux store
                  const docRef = doc(db, "users", resp.user.uid);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                    dispatch(setUserData(docSnap.data));
                    history.push("/admin/dashboard");
                  } else {
                    console.log("No such document!");
                  }
                })
                .catch((err) => {});
            } catch (error) {
              console.log("ERR: ", error?.message);
            }
          })
          .catch((err) => {
            console.log("ERR: ", err?.message);
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  // const formik = useFormik({
  //   initialValues: {
  //     firstName: "",
  //     lastName: "",
  //     phone: "",
  //     email: "",
  //     password: "",
  //   },
  //   validationSchema: validationSchema,

  //   onSubmit: (values) => {
  //     alert("Heergf");
  //     // try {
  //     //   const resp = await createUser(values.email, values.password);

  //     //   if (resp.user) {
  //     //     // Add a second document with a generated ID.
  //     //     try {
  //     //       const docRef = await addDoc(collection(db, "users"), {
  //     //         id: resp.user.uid,
  //     //         firstname: values.firstName,
  //     //         lastname: values.lastName,
  //     //         phone: values.phone,
  //     //         email: values.email,
  //     //         userType: "super",
  //     //       });
  //     //       console.log("Document written with ID: ", docRef.id);
  //     //     } catch (e) {
  //     //       console.error("Error adding document: ", e);
  //     //     }
  //     //   }
  //     // } catch (error) {}
  //   },
  // });

  return (
    <div>
      <ValidatorForm onSubmit={submitForm} sx={{ mt: 1 }}>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12} sm={12}>
            <TextValidator
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First name"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              type="text"
              autoFocus
              placeholder="First name"
              variant="outlined"
              validators={["required"]}
              errorMessages={["First name is required"]}
            />
          </Grid>

          <Grid item md={6} xs={12} sm={12}>
            <TextValidator
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last name"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              type="text"
              placeholder="Last name"
              variant="outlined"
              validators={["required"]}
              errorMessages={["Last name is required"]}
            />
          </Grid>
        </Grid>
        <TextValidator
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="Email Address"
          variant="outlined"
          validators={["required"]}
          errorMessages={["Email address is required"]}
        />
        <TextValidator
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showCode ? "text" : "password"}
          id="password"
          onChange={handleChange}
          value={formValues.password}
          autoComplete="current-password"
          placeholder="Password"
          variant="outlined"
          validators={["required"]}
          errorMessages={["Password is required"]}
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
        >
          Sign In
        </Button>
        <Typography variant="body1" component="h1" />
        <Link onClick={() => history.push("/login")} variant="body2">
          {"Already have an account? Login"}
        </Link>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </ValidatorForm>
    </div>
  );
};

export default SignupForm;

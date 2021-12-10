import React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { signInUser } from "../../../domain/service";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import { addDoc, collection } from "firebase/firestore";
import {
  db,
  doc,
  getDoc,
  setPersistence,
  browserSessionPersistence,
  auth,
} from "../../../data/firebase";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import CircularProgress from "@mui/material/CircularProgress";
import { RefreshOutlined } from "@mui/icons-material";

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

const LoginForm = () => {
  const [formValues, setFormValues] = React.useState({
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

  const submitForm = async (e) => {
    setIsLoading(true);

    setPersistence(auth, browserSessionPersistence)
      .then((re) => {
        signInUser(formValues.email, formValues.password)
          .then(async (resp) => {
            //Now get user data
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
        // console.log("NUI", resp);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <div>
      <ValidatorForm onSubmit={submitForm} sx={{ mt: 1 }}>
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
        {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        /> */}
        <Button
          disabled={isLoading}
          endIcon={
            isLoading && (
              <CircularProgress>
                <RefreshOutlined />
              </CircularProgress>
            )
          }
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Log In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </ValidatorForm>
    </div>
  );
};

export default LoginForm;

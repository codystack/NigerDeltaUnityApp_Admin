import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import Backdrop from "@mui/material/Backdrop";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { db, doc, setDoc, getDoc } from "../../../data/firebase";
import { createUser } from "../../../domain/service";
import { useSnackbar } from "notistack";
import { MenuItem } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  mb: {
    marginBottom: 10,
  },
}));

const userTypes = ["Admin", "Editor"];

const CreateAdminForm = (props) => {
  const { setOpen } = props;
  const classes = useStyles();

  const [showCode, setShowCode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    userType: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const createAdmin = (e) => {
    setIsLoading(true);
    const timeNow = new Date();
    createUser(formValues.email, formValues.password)
      .then(async (resp) => {
        try {
          setDoc(doc(db, "users", resp?.user?.uid), {
            id: resp?.user?.uid,
            firstname: formValues.firstname,
            lastname: formValues.lastname,
            phone: formValues.phone,
            email: formValues.email,
            password: formValues.password,
            userType: formValues.userType,
            isBlocked: false,
            createdAt: timeNow,
            updatedAt: timeNow,
          })
            .then(async (result) => {
              setIsLoading(false);
              setOpen(false);
              const docRef = doc(db, "users", resp?.user?.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                enqueueSnackbar(`New user created successfully`, {
                  variant: "success",
                });
              }
            })
            .catch((err) => {
              setIsLoading(false);
              enqueueSnackbar(
                `${err?.message || "Check your internet connection"}`,
                {
                  variant: "error",
                }
              );
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
      .catch((err) => {
        setIsLoading(false);
        enqueueSnackbar(`${err?.message || "Check your internet connection"}`, {
          variant: "error",
        });
        // console.log("ERR: ", err?.message);
      });
  };

  return (
    <div style={{ width: 360 }}>
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
      <ValidatorForm onSubmit={createAdmin}>
        <TextValidator
          className={classes.mb}
          id="firstname"
          label="First name"
          size="small"
          variant="outlined"
          value={formValues.firstname}
          onChange={handleChange}
          name="firstname"
          fullWidth
          required
          validators={["required"]}
          errorMessages={["First name is required"]}
        />

        <TextValidator
          className={classes.mb}
          id="lastname"
          label="Last name"
          size="small"
          variant="outlined"
          value={formValues.lastname}
          onChange={handleChange}
          name="lastname"
          fullWidth
          required
          validators={["required"]}
          errorMessages={["Last name is required"]}
        />

        <TextValidator
          className={classes.mb}
          id="email"
          label="Email address"
          size="small"
          variant="outlined"
          value={formValues.email}
          onChange={handleChange}
          name="email"
          fullWidth
          required
          type="email"
          validators={["required"]}
          errorMessages={["Email address is required"]}
        />

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
          errorMessages={["Phone number is required"]}
        />

        <SelectValidator
          margin="normal"
          value={formValues.userType}
          onChange={handleChange}
          label="Role"
          name="userType"
          fullWidth
          variant="outlined"
          size="small"
          validators={["required"]}
          errorMessages={["User role is required"]}
        >
          {userTypes?.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </SelectValidator>

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

export default CreateAdminForm;

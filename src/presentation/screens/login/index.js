import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import LoginForm from "../../forms/login";
import pattern from "../../../assets/images/pattern.png";
import logo from "../../../assets/images/logo_white.png";

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

const Login = () => {
  let history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    history.push("/dashboard");
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
        backgroundColor: (t) =>
          t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
        backgroundPosition: "center",
      }}
    >
      <CssBaseline />

      <Grid item xs={12} sm={8} md={6} component="div">
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            my: "auto",
            height: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <LoginForm />
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          height: "100vh",
          backgroundColor: "#0C0C77",
        }}
      >
        <div
          // className="login-glass"
          style={{
            height: "100vh",
            backgroundImage: "url(" + pattern + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1000,
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              my: "auto",
              height: "100%",
            }}
          >
            <img src={logo} alt="img" width={156} />
            <Typography variant="h6" align="center" color="white">
              Niger Delta Unity App (NDUA)
            </Typography>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;

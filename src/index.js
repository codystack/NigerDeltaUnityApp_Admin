import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Store from "./data/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import Button from "@mui/material/Button";
// import { app, analytics, auth } from "./data/firebase";
import Theme from "./domain/helper/themes";

const theme = createTheme(Theme);
const notistackRef = React.createRef();
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key);
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={Store}>
        <SnackbarProvider
          ref={notistackRef}
          action={(key) => (
            <Button
              onClick={onClickDismiss(key)}
              style={{
                textTransform: "none",
                color: "white",
                fontFamily: "roboto",
              }}
            >
              Dismiss
            </Button>
          )}
          maxSnack={2}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          autoHideDuration={5000}
        >
          <App />
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();

import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Login from "./presentation/screens/login";
import Signup from "./presentation/screens/register";
import Dashboard from "./presentation/screens/dashboard";
import {
  PrivateRouteDashboard,
  PrivateRouteLogin,
  PrivateRouteSignup,
} from "./domain/helper/private-routes";
import React from "react";
import { auth } from "./data/firebase";
import { useDispatch } from "react-redux";

import { setUserData } from "./data/store/slice/user";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log("User Data: ", user);
        dispatch(setUserData(user));
      }
      // auth().onAuthStateChanged((user) => {
      //   if (user) {
      //     //User is signed in. Save to redux store
      //     console.log("USER: ", user);
      //     dispatch(setUserData(user));
      //     // var uid = user.uid;
      //   } else {
      //     //Not signed in
      //     dispatch(setUserData(null));
      //   }
      // });
    } catch (err) {
      console.log(err);
    }
    // return () => {};
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {/* <Route path="about" render={() => <Redirect to="about-us" />} /> */}
          {/* <Navigate to="/login" replace  /> */}
          {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
          <Redirect exact from="/" to="/login" />
          <PrivateRouteLogin path="/login" exact={true}>
            <Login />
          </PrivateRouteLogin>

          <PrivateRouteSignup exact={true} path="/signup">
            <Signup />
          </PrivateRouteSignup>

          <PrivateRouteDashboard path="/admin/dashboard">
            <Dashboard />
          </PrivateRouteDashboard>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

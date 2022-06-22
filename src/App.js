import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Login from "./presentation/screens/login";
import Dashboard from "./presentation/screens/dashboard";
import {
  PrivateRouteDashboard,
  PrivateRouteLogin,
} from "./domain/helper/private-routes";
import React from "react";
import { auth } from "./data/firebase";
import { useDispatch } from "react-redux";
import { db, doc, onSnapshot } from "./data/firebase";
import { setUserData } from "./data/store/slice/user";
import NotFound from "./presentation/screens/notfound";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    try {
      const user = auth.currentUser;
      if (user) {
        onSnapshot(doc(db, "users", "" + user.uid), (doc) => {
          // userData(doc.data());
          dispatch(setUserData(doc.data()));
          console.log(doc.data());
        });
      }

      // auth().onAuthStateChanged((user) => {
      //   if (user) {
      //     onSnapshot(doc(db, "users", "" + user.uid), (doc) => {
      //       dispatch(setUserData(doc.data()));
      //     });
      //   } else {
      //     dispatch(setUserData(null));
      //   }
      // });
    } catch (err) {
      // console.log(err);
    }
    // return () => {};
  }, [dispatch]);

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

          {/* <PrivateRouteSignup exact={true} path="/signup">
            <Signup />
          </PrivateRouteSignup> */}

          <PrivateRouteDashboard path="/admin/dashboard">
            <Dashboard />
          </PrivateRouteDashboard>

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

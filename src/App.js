import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Login from "./presentation/screens/login";
import Dashboard from "./presentation/screens/dashboard";
import {
  PrivateRouteDashboard,
  PrivateRouteLogin,
} from "./domain/helper/private-routes";
import React from "react";
import { auth, collection, query } from "./data/firebase";
import { useDispatch } from "react-redux";
import { db, doc, onSnapshot } from "./data/firebase";
import { setUserData } from "./data/store/slice/user";
import NotFound from "./presentation/screens/notfound";
import {
  setAdsData,
  setCategoriesData,
  setNewsData,
  setProjectsData,
  setStatesData,
  setVendorsData,
} from "./data/store/slice/cms";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    try {
      const user = auth.currentUser;
      if (user) {
        onSnapshot(doc(db, "users", "" + user.uid), (doc) => {
          // userData(doc.data());
          dispatch(setUserData(doc.data()));
        });
      }

      const statesQuery = query(collection(db, "states"));
      onSnapshot(statesQuery, (querySnapshot) => {
        const states = [];
        querySnapshot.forEach((doc) => {
          states.push(doc.data());
        });
        dispatch(setStatesData(states));
      });

      const newsQuery = query(collection(db, "news"));
      onSnapshot(newsQuery, (querySnapshot) => {
        const news = [];
        querySnapshot.forEach((doc) => {
          news.push(doc.data());
        });
        dispatch(setNewsData(news));
      });

      const projectsQuery = query(collection(db, "projects"));
      onSnapshot(projectsQuery, (querySnapshot) => {
        const projects = [];
        querySnapshot.forEach((doc) => {
          projects.push(doc.data());
        });
        dispatch(setProjectsData(projects));
      });

      const vendorsQuery = query(collection(db, "directories-vendors"));
      onSnapshot(vendorsQuery, (querySnapshot) => {
        const vendors = [];
        querySnapshot.forEach((doc) => {
          vendors.push(doc.data());
        });
        dispatch(setVendorsData(vendors));
      });

      const categoryQuery = query(collection(db, "categories"));
      onSnapshot(categoryQuery, (querySnapshot) => {
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push(doc.data());
        });
        dispatch(setCategoriesData(categories));
      });

      const adsQuery = query(collection(db, "ads"));
      onSnapshot(adsQuery, (querySnapshot) => {
        const ads = [];
        querySnapshot.forEach((doc) => {
          ads.push(doc.data());
        });
        dispatch(setAdsData(ads));
      });
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

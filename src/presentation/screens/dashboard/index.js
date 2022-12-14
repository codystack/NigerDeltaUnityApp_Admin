import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { makeStyles } from "@mui/styles";
import Box from "@mui/system/Box";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import Drawer1 from "../../components/dashboard/drawer/Drawer1";
import Drawer2 from "../../components/dashboard/drawer/Drawer2";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";

import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

import Typography from "@mui/material/Typography";
import HomePage from "./tabs/home";
import ManageApp from "./tabs/manage_app";
import ManageUsers from "./tabs/manage_users";
import Profile from "./tabs/profile";

import Categories from "./tabs/manage_app/categories/categories";
import NewsFeeds from "./tabs/manage_app/news/newsfeeds";
import NewsItem from "./tabs/manage_app/news/news_item";
import Projects from "./tabs/manage_app/projects";
import ProjectItem from "./tabs/manage_app/projects/project_item";
import Directories from "./tabs/manage_app/directories";
import PrivacyPolicy from "./tabs/manage_app/privacy-policy";
import TermsOfService from "./tabs/manage_app/terms-of-service";
import ContactUs from "./tabs/manage_app/contact-us";
import VendorItem from "./tabs/manage_app/directories/vendor_detail";
import ProductDetail from "./tabs/manage_app/directories/product_detail";
import State from "./tabs/manage_app/states";
import History from "./tabs/manage_app/history";
import HistoryDetail from "./tabs/manage_app/history/history_detail";
import Education from "./tabs/manage_app/education";
import AddVendorForm from "../../forms/directories/add_vendor";
import AddNewsForm from "../../forms/news/add_news_form";
import AddProjectForm from "../../forms/projects/add_project_form";
import EditProjectForm from "../../forms/projects/update_project_form";
import AdsManager from "./tabs/manage_app/ads";
import CreateAdsForm from "../../forms/ads/add_advert_form";
import EditNewsForm from "../../forms/news/update_news_form";
import AddHistoryForm from "../../forms/history/add_history_form";
import EditHistoryForm from "../../forms/history/update_history_form";
import EducationDetail from "./tabs/manage_app/education/education_detail";
import EditEducationForm from "../../forms/education/edit_education";
import EditVendorForm from "../../forms/directories/edit_vendor";
import AddProductForm from "../../forms/products/add_product";
import EditProductForm from "../../forms/products/edit_product";
import UpdatePolicyForm from "../../forms/privacy-policy/update_policy_form";
import UpdateTofSForm from "../../forms/terms-of-service";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UpdateAdsForm from "../../forms/ads/update_advert_form";
import {
  query,
  collection,
  onSnapshot,
  db,
  doc,
  auth,
} from "../../../data/firebase/";
import {
  setAdsData,
  setCategoriesData,
  setNewsData,
  setProjectsData,
  setStatesData,
  setVendorsData,
} from "../../../data/store/slice/cms";
import { setUserData } from "../../../data/store/slice/user";

const drawerWidth = 270;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  grow: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    background: "white",
    color: "black",
    boxShadow: "none",
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    backgroundColor: "#F8F9FA",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  contentPadding: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: 15,
    margin: "auto",
  },
}));

function Dashboard(props) {
  const { window } = props;
  const classes = useStyles();
  // const theme = useTheme();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openSignoutBackDrop, setOpenSignoutBackDrop] = React.useState(false);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleBackdrop = (value) => {
    setOpenSignoutBackDrop(value);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useEffect(() => {
    try {
      const user = auth.currentUser;
      if (user) {
        onSnapshot(doc(db, "users", "" + user.uid), (doc) => {
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
    } catch (e) {}
  }, [dispatch]);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    ></Menu>
  );

  const initials =
    userData?.firstname?.slice(0, 1).toUpperCase() +
    userData?.lastname?.slice(0, 1).toUpperCase();

  let fullname = userData?.firstname + " " + userData?.lastname;

  return (
    <div className={classes.root}>
      <Backdrop style={{ zIndex: 5000 }} open={openSignoutBackDrop}>
        <CircularProgress
          size={90}
          thickness={3.0}
          style={{ color: "white" }}
        />
      </Backdrop>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {1 > 2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  style={{ margin: "auto", paddingRight: 3 }}
                ></Typography>
              </div>
            )}
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              edge="end"
              aria-controls={menuId}
              aria-haspopup="true"
              //onClick={handleNotificationMenuOpen}
            ></IconButton>

            <Box
              display="flex"
              flexDirection={"row"}
              justifyContent="end"
              alignItems="center"
            >
              <Typography pr={1}>
                {fullname?.length > 16
                  ? fullname?.slice(0, 12) + "..."
                  : fullname}
              </Typography>
              <Avatar
                src={userData?.image !== "" ? userData?.image : ""}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 32 / 2,
                  fontSize: 36,
                }}
              >
                {userData?.image !== "" ? "" : initials}
              </Avatar>
            </Box>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer1
            setMobileOpen={setMobileOpen}
            mobileOpen={mobileOpen}
            handleBackdrop={handleBackdrop}
            drawerVariant="temporary"
            anchor="left"
            handleDrawerToggle={handleDrawerToggle}
            window={window}
          />
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer2 handleBackdrop={handleBackdrop} />
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* Main switch routing here */}
        <div className={classes.contentPadding}>
          <Switch>
            <Redirect
              exact
              from="/admin/dashboard"
              to="/admin/dashboard/home"
            />
            <Route path="/admin/dashboard/home" exact={true}>
              <HomePage />
            </Route>

            <Route path="/admin/dashboard/manage-app" exact={true}>
              <ManageApp />
            </Route>

            <Route path="/admin/dashboard/manage-users" exact={true}>
              <ManageUsers />
            </Route>

            <Route path="/admin/dashboard/profile" exact={true}>
              <Profile />
            </Route>

            <Route path="/admin/dashboard/manage-app/categories" exact={true}>
              <Categories />
            </Route>

            <Route path="/admin/dashboard/manage-app/news-feeds" exact={true}>
              <NewsFeeds />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/news-feeds/create"
              exact={true}
            >
              <AddNewsForm />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/news-feeds/edit"
              exact={true}
            >
              <EditNewsForm />
            </Route>

            <Route path="/admin/dashboard/manage-app/projects" exact={true}>
              <Projects />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/projects/create"
              exact={true}
            >
              <AddProjectForm />
            </Route>

            <Route path="/admin/dashboard/manage-app/ads" exact={true}>
              <AdsManager />
            </Route>
            <Route path="/admin/dashboard/manage-app/ads/create" exact={true}>
              <CreateAdsForm />
            </Route>
            <Route path="/admin/dashboard/manage-app/ads:id/edit" exact={true}>
              <UpdateAdsForm />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/projects/update"
              exact={true}
            >
              <EditProjectForm />
            </Route>

            <Route path="/admin/dashboard/manage-app/states" exact={true}>
              <State />
            </Route>

            <Route path="/admin/dashboard/manage-app/history" exact={true}>
              <History />
            </Route>
            <Route
              path="/admin/dashboard/manage-app/history/create"
              exact={true}
            >
              <AddHistoryForm />
            </Route>
            <Route path="/admin/dashboard/manage-app/history/edit" exact={true}>
              <EditHistoryForm />
            </Route>
            <Route path="/admin/dashboard/manage-app/history:id" exact={true}>
              <HistoryDetail />
            </Route>

            <Route path="/admin/dashboard/manage-app/vendors" exact={true}>
              <Directories />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/vendors/add-new"
              exact={true}
            >
              <AddVendorForm />
            </Route>

            <Route path="/admin/dashboard/manage-app/vendors:id" exact={true}>
              <VendorItem />
            </Route>
            <Route
              path="/admin/dashboard/manage-app/vendors:id/edit"
              exact={true}
            >
              <EditVendorForm />
            </Route>

            <Route path="/admin/dashboard/manage-app/education" exact={true}>
              <Education />
            </Route>
            <Route path="/admin/dashboard/manage-app/education:id" exact={true}>
              <EducationDetail />
            </Route>
            <Route
              path="/admin/dashboard/manage-app/education/edit"
              exact={true}
            >
              <EditEducationForm />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/vendors:id/products:de"
              exact={true}
            >
              <ProductDetail />
            </Route>
            <Route
              path="/admin/dashboard/manage-app/vendors:id/products/add-new"
              exact={true}
            >
              <AddProductForm />
            </Route>
            <Route
              path="/admin/dashboard/manage-app/vendors:id/products:de/edit"
              exact={true}
            >
              <EditProductForm />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/privacy-policy"
              exact={true}
            >
              <PrivacyPolicy />
              {/* UpdatePolicyForm */}
            </Route>
            <Route
              path="/admin/dashboard/manage-app/privacy-policy/edit"
              exact={true}
            >
              <UpdatePolicyForm />
            </Route>

            <Route path="/admin/dashboard/manage-app/contact-us" exact={true}>
              <ContactUs />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/terms-of-service"
              exact={true}
            >
              <TermsOfService />
            </Route>
            <Route
              path="/admin/dashboard/manage-app/terms-of-service/edit"
              exact={true}
            >
              <UpdateTofSForm />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/news-feeds:id"
              exact={true}
            >
              <NewsItem />
            </Route>

            <Route path="/admin/dashboard/manage-app/projects:id" exact={true}>
              <ProjectItem />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

export default withRouter(Dashboard);

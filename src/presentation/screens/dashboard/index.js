import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { makeStyles, useTheme } from "@mui/styles";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import Drawer1 from "../../components/dashboard/drawer/Drawer1";
import Drawer2 from "../../components/dashboard/drawer/Drawer2";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";

import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

import SearchIcon from "@mui/icons-material/Search";
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
  const theme = useTheme();
  // let { path, url } = useRouteMatch();
  // const { enqueueSnackbar } = useSnackbar();
  // const { notifications, userData } = useSelector((state) => state.user);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openSignoutBackDrop, setOpenSignoutBackDrop] = React.useState(false);
  // const [openNotiModal, setOpenNotiModal] = React.useState(false);
  // const dispatch = useDispatch();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleBackdrop = (value) => {
    setOpenSignoutBackDrop(value);
    // console.log("b", openNotiModal);
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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const openMobileNotificationModal = (event) => {
  //   handleMenuClose();
  // setOpenNotiModal(true);
  // };

  // const closeMobileNotificationModal = (event) => {
  //   setOpenNotiModal(false);
  // };

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

  // const container =
  //   window !== undefined ? () => window().document.body : undefined;
  // let resultTrail;
  // const initials = userData?.First_Name?.slice(0, 1).toUpperCase() + userData?.Surname?.slice(0, 1).toUpperCase();
  // const trailName = userData?.First_Name + " " + userData?.Surname;

  // if (trailName?.length > 12) {
  //     resultTrail = trailName?.slice(0, 12) + "...";
  // }
  // else {
  //     resultTrail = trailName?.slice(0, 12);
  // }

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
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <SearchIcon style={{ color: theme.palette.secondary.main }} />
            </IconButton>
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

            <Route path="/admin/dashboard/manage-app/history:id" exact={true}>
              <HistoryDetail />
            </Route>

            <Route path="/admin/dashboard/manage-app/education" exact={true}>
              <Education />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/vendors:id/products:de"
              exact={true}
            >
              <ProductDetail />
            </Route>

            <Route
              path="/admin/dashboard/manage-app/privacy-policy"
              exact={true}
            >
              <PrivacyPolicy />
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

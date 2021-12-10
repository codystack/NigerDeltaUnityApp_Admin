import React from "react";
import List from "@mui/material/List";

import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashBoardIcon from "@mui/icons-material/DashboardCustomize";
import AppSettingsAlt from "@mui/icons-material/AppSettingsAlt";
import SupervisedUserCircle from "@mui/icons-material/SupervisedUserCircle";
import AccountCircle from "@mui/icons-material/AccountCircle";

import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
// import logo from "../../../assets/img/campus-logo.png";
import { useSnackbar } from "notistack";
// import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@mui/styles";
import { useLocation, useHistory } from "react-router-dom";

const drawerWidth = 270;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "275px",
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  listRoot: {
    width: "100%",
    padding: theme.spacing(1),
  },
}));

// const ListItem = withStyles({
//     root: {
//         "&$selected": {
//             backgroundColor: "#4C3992",
//             color: "#4C3992"
//         },
//         "&$selected:hover": {
//             backgroundColor: "#221B44",
//             color: "#221B44"
//         },
//         "&:hover": {
//             backgroundColor: "#9A88F2",
//             color: "#9A88F2"
//         }
//     },
//     selected: {}
// })(MUIListItem);

const DrawerContent = (props) => {
  const classes = useStyles();
  const { mobileOpen, setMobileOpen } = props;
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  //   const { userStatus, userData } = useSelector((state) => state.user);
  //   const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  //   const container =
  //     props.window !== undefined ? () => window().document.body : undefined;

  const drawerItems = [
    {
      text: "Dashboard",
      icon: (
        <DashBoardIcon
          style={
            selectedIndex === 0 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/",
    },
    {
      text: "Manage App",
      icon: (
        <AppSettingsAlt
          style={
            selectedIndex === 1 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/dashboard/manage-app",
    },
    {
      text: "Manage Users",
      icon: (
        <SupervisedUserCircle
          style={
            selectedIndex === 2 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/dashboard/manage-users",
    },
    {
      text: "Profile",
      icon: (
        <AccountCircle
          style={
            selectedIndex === 3 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/dashboard/profile",
    },
  ];

  const handleListItemClick = (to, index) => {
    history.push(to);
    setSelectedIndex(index);
    // setMobileOpen(!mobileOpen);
  };

  React.useLayoutEffect(() => {
    if (location.pathname.indexOf("home") !== -1) {
      setSelectedIndex(0);
    } else if (location.pathname.indexOf("need") !== -1) {
      setSelectedIndex(1);
    }
    if (location.pathname.indexOf("profile") !== -1) {
      setSelectedIndex(2);
    }
  }, [location]);

  const signOut = async () => {
    props.handleBackdrop(true);
    try {
      props.handleBackdrop(false);
      enqueueSnackbar(`Successfully logged out`, { variant: "success" });
      //   history.replace({
      //     pathname: "/",
      //   });
      //   navigate.
    } catch (err) {
      enqueueSnackbar(
        `${
          err?.response?.data?.error ||
          err?.response?.statusText ||
          "Check your internet connection."
        }`,
        { variant: "error" }
      );
    } finally {
      //   history.go(0);
    }
  };

  const myDrawer = (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className={classes.toolbar}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <img src={logo} style={{ width: 100 }} alt="site logo" /> */}
      </div>

      <Divider />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <List className={classes.listRoot}>
          {drawerItems.map((item, index) => {
            const { text, icon, to } = item;
            return (
              <ListItem
                style={{ borderRadius: 6 }}
                button
                key={index}
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(to, index)}
              >
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </div>

      <div
        style={{
          flexDirection: "column",
          marginTop: "auto",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Button
          startIcon={<PowerSettingsNewIcon />}
          style={{ textTransform: "none" }}
          onClick={signOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );

  return myDrawer;
};

export default DrawerContent;

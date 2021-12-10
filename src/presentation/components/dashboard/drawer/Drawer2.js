import React from "react";
import { Drawer as MUIDrawer } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DashBoardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { withRouter } from "react-router-dom";
import { makeStyles, useTheme } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import logo from "../../../../assets/images/icon_blue.png";

import { useSnackbar } from "notistack";
import Skeleton from "@mui/material/Skeleton";

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

const Drawer2 = (props) => {
  const classes = useStyles();
  const { history } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  // const { userStatus, userData } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const container =
    props.window !== undefined ? () => window().document.body : undefined;

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
      to: "/admin/dashboard/",
    },
    {
      text: "Manage App",
      icon: (
        <SchoolOutlinedIcon
          style={
            selectedIndex === 1 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/admin/dashboard/manage-app",
    },
    {
      text: "Manage Users",
      icon: (
        <PeopleOutlinedIcon
          style={
            selectedIndex === 2 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/admin/dashboard/manage-users",
    },
    {
      text: "Profile",
      icon: (
        <PersonOutlineIcon
          style={
            selectedIndex === 3 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/admin/dashboard/profile",
    },
  ];

  let picSize, cornerSize;
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  if (xs) {
    cornerSize = 76;
    picSize = 70;
  } else if (sm) {
    cornerSize = 96;
    picSize = 90;
  } else if (md) {
    cornerSize = 116;
    picSize = 110;
  } else {
    cornerSize = 136;
    picSize = 130;
  }

  const handleListItemClick = (to, index) => {
    history.push(to);
    setSelectedIndex(index);
  };

  const signOut = async () => {
    props.handleBackdrop(true);
    try {
      props.handleBackdrop(false);
      enqueueSnackbar(`Successfully logged out`, { variant: "success" });
      history.replace({
        pathname: "/community-rep",
      });
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
      history.go(0);
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
        <a href="/">
          <img src={logo} style={{ width: 100 }} alt="site logo" />
        </a>
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
            if (4 > 2) {
              return (
                <ListItem
                  button
                  key={index}
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(to, index)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              );
            } else {
              return (
                <Skeleton
                  key={index}
                  component="li"
                  variant="rect"
                  animation="wave"
                  height={30}
                  style={{ margin: 10 }}
                />
              );
            }
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

  return (
    <MUIDrawer
      variant="permanent"
      open
      classes={{ paper: classes.drawerPaper }}
    >
      {myDrawer}
    </MUIDrawer>
  );
};

export default withRouter(Drawer2);

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";
import categoryImage from "../../../../../assets/images/category_ndua_admin.jpeg";
import directoryImge from "../../../../../assets/images/directories_ndua_admin.jpeg";
import newsImage from "../../../../../assets/images/news_ndua_admin.jpeg";
import projectsImage from "../../../../../assets/images/projects_ndua_admin.jpeg";
import adsImage from "../../../../../assets/images/ads_ndua_admin.jpeg";
import privacyImage from "../../../../../assets/images/privacy.jpeg";
import termsImage from "../../../../../assets/images/terms_of_service.jpeg";
import contactUsImage from "../../../../../assets/images/handshake.jpeg";

import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 236,
  },
  image: {
    height: 144,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
  },
}));

const CardItem = (props) => {
  const classes = useStyles();
  const { image, title, excerpt, to } = props;
  const history = useHistory();

  return (
    <Card elevation={4} className={classes.root}>
      <CardContent>
        <CardMedia image={image} className={classes.image} />
        <br />
        <div className={classes.row}>
          <div className={classes.column}>
            <Typography variant="body1" color="blue">
              {title}
            </Typography>
          </div>
          <div>
            <Button
              size="small"
              variant="contained"
              onClick={() => history.push(to)}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ManageApp = () => {
  let list = [
    {
      title: "Categories",
      desc: "Manage app categories",
      to: "/admin/dashboard/manage-app/categories",
      image: categoryImage,
    },
    {
      title: "News Feeds",
      desc: "Manage app news feeds",
      to: "/admin/dashboard/manage-app/news-feeds",
      image: newsImage,
    },
    {
      title: "Projects",
      desc: "Manage app projects",
      to: "/admin/dashboard/manage-app/projects",
      image: projectsImage,
    },
    {
      title: "Directories",
      desc: "Manage app directories",
      to: "/admin/dashboard/manage-app/vendors",
      image: directoryImge,
    },
    {
      title: "Ads Center",
      desc: "Manage adverts",
      to: "/ads-center",
      image: adsImage,
    },
    {
      title: "Privacy Policy",
      desc: "Manage privacy",
      to: "/admin/dashboard/manage-app/privacy-policy",
      image: privacyImage,
    },
    {
      title: "Terms of Service",
      desc: "Manage terms of service",
      to: "/admin/dashboard/manage-app/terms-of-service",
      image: termsImage,
    },
    {
      title: "Contact Us",
      desc: "Manage contact us",
      to: "/admin/dashboard/manage-app/contact-us",
      image: contactUsImage,
    },
  ];

  return (
    <div>
      <Grid
        container
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {list?.map((_, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <CardItem
              image={list[index].image}
              title={list[index].title}
              excerpt={list[index].desc}
              to={list[index].to}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ManageApp;

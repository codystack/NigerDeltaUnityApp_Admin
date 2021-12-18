import React from "react";
import Card from "@mui/material/Card";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  onSnapshot,
  query,
  where,
  collection,
  db,
} from "../../../../../data/firebase";
import {
  DataGrid,
  GridToolbarContainer,
  GridHeader,
  GridFilterToolbarButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
// import GridColumnsToolbarButton
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CustomNoRowsOverlay from "../../../../components/misc/placeholder/custom_no_data";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  button: {
    textTransform: "none",
    fontSize: 11,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const CustomToolbar = () => {
  const theme = useTheme();

  return (
    <GridToolbarContainer
      color="secondary"
      style={{
        display: "flex",
        padding: 16,
      }}
    >
      <Paper style={{ padding: 6, borderRadius: 10 }}>
        <GridHeader />
      </Paper>
      {/* <Paper
        style={{ padding: 6, borderRadius: 10, marginLeft: 5, marginRight: 5 }}
      >
        <GridFilterToolbarButton />
      </Paper> */}
      <Paper
        style={{
          alignSelf: "flex-end",
          padding: 6,
          marginLeft: "auto",
          borderRadius: 10,
        }}
      >
        <GridToolbarExport />
      </Paper>
    </GridToolbarContainer>
  );
};

const HomePage = () => {
  const classes = useStyles();

  const [projectsList, setProjectsList] = React.useState(null);
  const [newsList, setNewsList] = React.useState(null);
  const [categoriesList, setCategoriesList] = React.useState(null);
  const [usersList, setUsersList] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const q = query(collection(db, "categories"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setCategoriesList(categories);
      console.log("Current cities in CA: ", categories);
    });
    return () => {};
  }, []);

  React.useEffect(() => {
    const q = query(collection(db, "news"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const news = [];
      querySnapshot.forEach((doc) => {
        news.push(doc.data());
      });
      setNewsList(news);
    });
    return () => {};
  }, []);

  React.useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const proj = [];
      querySnapshot.forEach((doc) => {
        proj.push(doc.data());
      });
      setProjectsList(proj);
    });
    return () => {};
  }, []);

  React.useEffect(() => {
    const q = query(collection(db, "users"), where("userType", "==", "public"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usrs = [];
      querySnapshot.forEach((doc) => {
        usrs.push(doc.data());
      });
      setUsersList(usrs.slice(0, 5));
    });
    return () => {};
  }, []);

  // if (usersList) {
  //   console.log("Filtered: ", usersList);
  // }

  const columns = [
    {
      field: "photo",
      headerName: "Image",
      width: 75,
      renderCell: (params) => (
        <Avatar alt="Profile Picture" src={params.value} />
      ),
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 180,
      valueGetter: (params) =>
        `${params.row.firstname || ""} ${params.row.lastname || ""}`,
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 110,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 110,
      editable: true,
    },
  ];

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7} md={7}>
          <div style={{ display: "flex", height: "100%", padding: 4 }}>
            <div style={{ flexGrow: 1 }}>
              {usersList && (
                <DataGrid
                  rows={usersList}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                  components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                    Toolbar: CustomToolbar,
                  }}
                />
              )}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={5} md={5}>
          <Card sx={{ mb: 3, mt: 3 }}>
            <div className={classes.row} style={{ padding: 10 }}>
              <Typography>Total categories</Typography>
              <Typography>{categoriesList?.length}</Typography>
            </div>
            <Divider color="primary" />
            <div className={classes.row} style={{ padding: 10 }}>
              <Typography>Total news feeds</Typography>
              <Typography>{newsList?.length}</Typography>
            </div>
            <Divider color="primary" />
            <div className={classes.row} style={{ padding: 10 }}>
              <Typography>Total projects</Typography>
              <Typography>{projectsList?.length}</Typography>
            </div>
            <Divider color="primary" />
            <div className={classes.row} style={{ padding: 10 }}>
              <Typography>Total vendors</Typography>
              <Typography>{0}</Typography>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;

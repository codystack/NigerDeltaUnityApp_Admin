import React from "react";
import Card from "@mui/material/Card";
import { Toolbar } from "@mui/material";
import {
  onSnapshot,
  query,
  where,
  collection,
  db,
} from "../../../../../data/firebase";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import OSPie from "../../../../components/misc/charts/pie";
import UsersTable from "../../../../components/dashboard/table/user";

const CardItem = (props) => {
  let { title, value, ml, mr } = props;
  return (
    <Card elevation={2} sx={{ width: 175, mr: mr, ml: ml }}>
      <Box
        paddingX={4}
        paddingY={5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" gutterBottom fontWeight={"600"}>
          {value}
        </Typography>
        <Typography>{title}</Typography>
      </Box>
    </Card>
  );
};

const HomePage = () => {
  // const classes = useStyles();
  const [usersList, setUsersList] = React.useState(null);
  const [androidUsers, setAndroidUsers] = React.useState(null);
  const [iosUsers, setiOSUsers] = React.useState(null);
  // const [isLoading, setIsLoading] = React.useState(false);

  const { newsData, statesData, projectsData, vendorsData, adsData } =
    useSelector((state) => state.cms);

  // const { userData } = useSelector((state) => state.user);

  React.useEffect(() => {
    const q = query(collection(db, "users"), where("userType", "==", "public"));
    onSnapshot(q, (querySnapshot) => {
      const usrs = [];
      const android = [];
      const ios = [];
      querySnapshot.forEach((doc) => {
        usrs.push(doc.data());
        console.log("USER DATA:::", doc.data());
        console.log("USET TYOE::", doc.get("osPlatform"));
        if (doc.get("osPlatform") === "android") {
          android.push(doc.data());
        } else if ("osPlatform" === "ios") {
          ios.push(doc.data());
        }
      });
      setiOSUsers(ios);
      setAndroidUsers(android);
      setUsersList(usrs.slice(0, 5));
    });
    return () => {
      setUsersList([]);
    };
  }, []);

  return (
    <div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="stretch"
        alignItems="center"
        width="100%"
      >
        <CardItem ml={0} mr={1} title="News Feeds" value={newsData?.length} />
        <CardItem ml={1} mr={1} title="Projects" value={projectsData?.length} />
        <CardItem ml={1} mr={1} title="States" value={statesData?.length} />
        <CardItem ml={1} mr={1} title="Vendors" value={vendorsData?.length} />
        <CardItem ml={1} mr={0} title="Ads" value={adsData?.length} />
        {/* <CardItem title="Ads" value={statesData?.length} /> */}
      </Box>
      <Toolbar />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7} md={7}>
          <div style={{ display: "flex", height: "100%", padding: 4 }}>
            <div style={{ flexGrow: 1 }}>
              {usersList && (
                <UsersTable />
                // <DataGrid
                //   rows={usersList}
                //   columns={columns}
                //   pageSize={5}
                //   rowsPerPageOptions={[5]}
                //   checkboxSelection
                //   disableSelectionOnClick
                //   components={{
                //     NoRowsOverlay: CustomNoRowsOverlay,
                //     Toolbar: CustomToolbar,
                //   }}
                // />
              )}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={5} md={5}>
          <Card elevation={2}>
            <OSPie
              sampleData={[
                ["Android", 100 - androidUsers?.length],
                ["iOS", iosUsers?.length],
                ["Others", 30],
              ]}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;

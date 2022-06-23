import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { Divider, Typography } from "@mui/material";
import {
  Add,
  Call,
  DeleteOutlined,
  EditOutlined,
  LocationOn,
  Person,
  PinDrop,
  Web,
} from "@mui/icons-material";
import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import IconButton from "@mui/material/IconButton";
import { Grid } from "@mui/material";
import {
  onSnapshot,
  query,
  collection,
  db,
  doc,
  ref,
  deleteObject,
  storage,
  deleteDoc,
} from "../../../../../../data/firebase";
import { useSnackbar } from "notistack";
// import AddNewsForm from "../../../../../forms/news/add_news_form";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 300,
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  main: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    margin: "auto",
    minHeight: 275,
    minWidth: 320,
    alignItems: "center",
  },
  cardMedia: {
    height: 156,
    width: "100%",
  },
  subRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
    alignItems: "center",
  },
  lhsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
  avatar: {
    height: 36,
    width: 36,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    padding: 4,
  },
}));

const AdsItem = (props) => {
  const { item, index } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  //   const history = useHistory();

  const deleteAd = () => {
    setOpenDelete(false);
    const fileRef = ref(storage, "ads/" + item?.id);

    deleteObject(fileRef)
      .then(async () => {
        try {
          await deleteDoc(doc(db, "ads", "" + item?.id));
          enqueueSnackbar(`Item deleted successfully`, {
            variant: "success",
          });
        } catch (error) {
          console.log("ERR: Del: ", error);
          enqueueSnackbar(`Item not deleted. Try again`, {
            variant: "error",
          });
        }
      })
      .catch((error) => {
        console.log("ErR: ", error);
      });
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${item?.title} ?`}
      </Typography>
      <br />
      <div className={classes.subRow}>
        <Button
          size="small"
          variant="contained"
          style={{ marginRight: 4 }}
          onClick={() => setOpenDelete(false)}
        >
          Cancel
        </Button>

        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={deleteAd}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <CustomDialog
        open={open}
        title="Update News"
        handleClose={() => setOpen(false)}
        // bodyComponent={
        // }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Ad"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />

      <Box
        display={"flex"}
        flexDirection="row"
        justifyContent={"space-between"}
        alignItems="center"
        padding={2}
      >
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent={"start"}
          alignItems="center"
        >
          <Typography variant="h5" pr={1}>
            {index + 1}
          </Typography>

          <img src={item?.image} alt="" width={"40%"} />
        </Box>

        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"start"}
          alignItems="start"
        >
          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <Person />
            <Typography paddingX={2} variant="h6">
              {item?.vendor}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <LocationOn />
            <Typography paddingX={2} variant="h6">
              {item?.address}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <Web />
            <Typography paddingX={2} variant="h6">
              {item?.website}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <Call />
            <Typography paddingX={2} variant="h6">
              {item?.phone}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <Call />
            <Typography paddingX={2} variant="h6">
              {item?.placement}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <PinDrop />
            <Typography
              paddingX={2}
              variant="h6"
              color={
                item?.status === "active"
                  ? "orangered"
                  : item?.status === "completed"
                  ? "green"
                  : "black"
              }
            >
              {item?.status}
            </Typography>
          </Box>
        </Box>

        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"end"}
          alignItems="end"
        >
          <IconButton color="error">
            <DeleteOutlined />
          </IconButton>

          <IconButton color="primary">
            <EditOutlined />
          </IconButton>
        </Box>
      </Box>
      <Divider />
    </>
  );
};

const AdsManager = () => {
  const classes = useStyles();
  const history = useHistory();
  // const [open, setOpen] = React.useState(false);
  const [adsList, setAdsList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "ads"));
    onSnapshot(q, (querySnapshot) => {
      const ads = [];
      querySnapshot.forEach((doc) => {
        let dat = doc.data();
        ads?.push(dat);
      });
      setAdsList(ads);
    });
  }, []);

  return (
    <div>
      {/* <CustomDialog
        open={open}
        title="Create NewsFeed"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddNewsForm setOpen={setOpen} />}
      /> */}
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography variant="h6" color="blue" fontSize={21}>
            Ads Manager
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => history.push("/admin/dashboard/manage-app/ads/create")}
        >
          Create Ad
        </Button>
      </div>
      <br />
      <div>
        {adsList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {adsList?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <AdsItem item={item} index={index} />
              </Grid>
            ))}
          </Grid>
        )}
        {adsList?.length < 1 && (
          <div className={classes.main}>
            <div style={{ marginTop: "auto" }}>
              <CloudOffIcon fontSize="large" />
              <Typography>No records found</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsManager;

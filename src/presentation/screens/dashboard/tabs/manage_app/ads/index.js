import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { Divider, List, ListItem, Typography } from "@mui/material";
import {
  Add,
  Call,
  DeleteOutlined,
  EditOutlined,
  LocationOn,
  Pages,
  Person,
  Public,
  ToggleOffOutlined,
  ToggleOnOutlined,
} from "@mui/icons-material";
// import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import StatusDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import IconButton from "@mui/material/IconButton";
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
  updateDoc,
} from "../../../../../../data/firebase";
import { useSnackbar } from "notistack";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box } from "@mui/system";
import CustomizedSwitch from "../../../../../components/misc/switch";

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
  const { item } = props;
  const classes = useStyles();
  const [openStatus, setOpenStatus] = React.useState(false);
  const [isActive, setIsActive] = React.useState(
    item?.status === "Active" ? true : false
  );
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  React.useEffect(() => {
    if (item?.status) {
      setIsActive(item?.status === "Active" ? true : false);
    }
  }, [item?.status]);

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

  const changeStatus = async () => {
    try {
      const mRef = doc(db, "ads", "" + item?.id);
      await updateDoc(mRef, {
        status: isActive === true ? "Active" : "Completed",
      });
      enqueueSnackbar(`Ads status updated successfully`, {
        variant: "success",
      });
      setOpenStatus(false);
      // history.goBack();
    } catch (error) {
      enqueueSnackbar(`${error?.message || "Check internet connection"}`, {
        variant: "error",
      });
    }
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${item?.name} ad?`}
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

  const statusBody = (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent={"center"}
      alignItems="center"
    >
      <Typography variant="h6" gutterBottom>
        {`Change Status`}
      </Typography>
      <br />
      <Typography gutterBottom>{item?.status}</Typography>
      <div className={classes.subRow}>
        {<CustomizedSwitch value={isActive} setValue={setIsActive} />}

        <Button variant="contained" onClick={() => changeStatus()}>
          Save
        </Button>
      </div>
    </Box>
  );

  return (
    <>
      <DeleteDialog
        open={openDelete}
        title="Delete Ad"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <StatusDialog
        open={openStatus}
        title="Change Ad Status"
        handleClose={() => setOpenStatus(false)}
        bodyComponent={statusBody}
      />
      <Box
        display={"flex"}
        flexDirection="row"
        justifyContent={"space-between"}
        alignItems="center"
        padding={2}
        width="100%"
      >
        <Box
          width={"100%"}
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
            <Typography gutterBottom paddingX={2}>
              {item?.name}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <LocationOn />
            <Typography gutterBottom paddingX={2}>
              {item?.address}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <Public />
            <Typography gutterBottom paddingX={2}>
              {item?.url}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <Call />
            <Typography gutterBottom paddingX={2}>
              {item?.phone}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <Pages />
            <Typography gutterBottom paddingX={2}>
              {item?.placement}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection="row"
            justifyContent={"start"}
            alignItems="center"
          >
            <ToggleOnOutlined />
            <Typography
              gutterBottom
              paddingX={2}
              color={
                item?.status === "Active"
                  ? "orangered"
                  : item?.status === "Completed"
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
          flexDirection="row"
          justifyContent={"center"}
          alignItems="center"
        >
          <img src={item?.banner} alt="" width={"75%"} />
        </Box>

        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"end"}
          alignItems="end"
        >
          <IconButton color="error" onClick={() => setOpenDelete(true)}>
            <Typography>Delete</Typography>
            <DeleteOutlined />
          </IconButton>

          <IconButton
            color="primary"
            onClick={() =>
              history.push({
                pathname:
                  "/admin/dashboard/manage-app/ads:" + item?.id + "/edit",
                state: {
                  id: item?.id,
                  banner: item?.banner,
                  url: item?.url,
                  startDate: item?.starts,
                  endDate: item?.ends,
                  placement: item?.placement,
                },
              })
            }
          >
            <Typography>Update</Typography>
            <EditOutlined />
          </IconButton>

          <IconButton color="primary" onClick={() => setOpenStatus(true)}>
            {item?.status === "Active" ? (
              <>
                <Typography>Stop</Typography>
                <ToggleOffOutlined />
              </>
            ) : item?.status === "Completed" ? (
              <>
                <Typography>Run again</Typography>
                {/* <ToggleOnOutlined /> */}
              </>
            ) : (
              <>
                <Typography>Start</Typography>
                <ToggleOnOutlined />
              </>
            )}
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
          <List
            disablePadding={true}
            // container
            // spacing={{ xs: 2, md: 2 }}
            // columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {adsList?.map((item, index) => (
              <ListItem key={index} disableGutters={true} divider={true}>
                <AdsItem item={item} />
              </ListItem>
            ))}
          </List>
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

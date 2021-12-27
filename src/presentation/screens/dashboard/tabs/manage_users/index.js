import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomDialog from "../../../../components/dashboard/dialogs/custom-dialog";
import {
  onSnapshot,
  query,
  collection,
  db,
} from "../../../../../data/firebase";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import UsersTable from "../../../../components/dashboard/users-table";
import CreateAdminForm from "../../../../forms/admin/create_admin_form";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 386,
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
    minHeight: 256,
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

const ManageUsers = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [newsList, setNewsList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "news"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const news = [];
      querySnapshot.forEach((doc) => {
        news.push(doc.data());
      });
      setNewsList(news);
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Create New Admin"
        handleClose={() => setOpen(false)}
        bodyComponent={<CreateAdminForm setOpen={setOpen} />}
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography variant="h6" color="blue" fontSize={18}>
            All Users
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Create Admin
        </Button>
      </div>
      <br />
      <Typography>Mobile Application Users</Typography>
      <div>
        <UsersTable />
      </div>
    </div>
  );
};

export default ManageUsers;

import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import UsersTable from "../../../../components/dashboard/table/user/index";
import CustomDialog from "../../../../components/dashboard/dialogs/custom-dialog";
import CreateAdminForm from "../../../../forms/admin/create_admin_form";

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

const GeneralUsers = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <CustomDialog
        title="CREATE NEW USER"
        bodyComponent={<CreateAdminForm setOpen={setOpen} />}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Typography
            textTransform={"uppercase"}
            variant="h4"
            fontWeight="700"
            color="primary.main"
          >
            GENERAL USERS
          </Typography>
        </div>
      </div>
      <br />
      <UsersTable />
    </div>
  );
};

export default GeneralUsers;

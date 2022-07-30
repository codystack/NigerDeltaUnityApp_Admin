import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import Fade from "@mui/material/Fade";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import CustomDialog from "../../dialogs/custom-dialog";
import DoneAll from "@mui/icons-material/DoneAll";
import { db, doc, updateDoc } from "../../../../../data/firebase";
import Cancel from "@mui/icons-material/Cancel";
import UsersPreview from "./preview";

const useStyles = makeStyles((theme) => ({
  awardRoot: {
    display: "flex",
    flexDirection: "column",
  },
  awardRow: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const ActionButton = ({ selected }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);
  const [openBlock, setOpenBlock] = React.useState(false);
  const [openUnblock, setOpenUnblock] = React.useState(false);

  const openAction = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useSelector((state) => state.user);
  const handleMoreAction = (e) => setAnchorEl(e.currentTarget);

  const handleCloseMoreAction = () => {
    setAnchorEl(null);
    setOpenBlock(false);
    setOpenPreviewModal(false);
  };
  const handlePreview = () => {
    setOpenPreviewModal(true);
  };

  const handleBlock = () => {
    setOpenBlock(true);
  };

  const handleUnblock = () => {
    setOpenUnblock(true);
  };

  const block = async () => {
    try {
      const mRef = doc(db, "users", "" + selected?.row?.id);
      await updateDoc(mRef, {
        isBlocked: true,
      });
      enqueueSnackbar(`${selected?.row?.name} successfully suspended`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  const unblock = async () => {
    try {
      const mRef = doc(db, "users", "" + selected?.row?.id);
      await updateDoc(mRef, {
        isBlocked: false,
      });
      enqueueSnackbar(`${selected?.row?.name} successfully unsuspended`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  const renderBlockConfirm = (
    <div className={classes.awardRoot}>
      <Typography>
        {`Are you sure you want to block ${selected?.row?.firstname} ${selected?.row?.lastname}?`}
      </Typography>
      <div className={classes.awardRow}>
        <Button
          className={classes.button}
          variant="contained"
          color="error"
          onClick={() => setOpenBlock(false)}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="success"
          onClick={block}
        >
          Confirm
        </Button>
      </div>
    </div>
  );

  const renderUnblockConfirm = (
    <div className={classes.awardRoot}>
      <Typography>
        {`Are you sure you want to unblock ${selected?.row?.name}?`}
      </Typography>
      <div className={classes.awardRow}>
        <Button
          className={classes.button}
          variant="contained"
          color="error"
          onClick={() => setOpenUnblock(false)}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="success"
          onClick={unblock}
        >
          Confirm
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <IconButton
        aria-label="actions"
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleMoreAction}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={openAction}
        onClose={handleCloseMoreAction}
        TransitionComponent={Fade}
        elevation={1}
      >
        <MenuItem onClick={handlePreview}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Preview" />
        </MenuItem>
        <CustomDialog
          title="Preview Data"
          bodyComponent={
            <UsersPreview item={selected?.row} setOpen={setOpenPreviewModal} />
          }
          open={openPreviewModal}
          handleClose={handleCloseMoreAction}
        />
        {userData && userData?.userType === "Admin" && selected?.row ? (
          <>
            {selected?.row?.isBlocked === true ? (
              <div>
                <>
                  <MenuItem onClick={handleUnblock}>
                    <ListItemIcon>
                      <DoneAll fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Unblock" />
                  </MenuItem>
                  <CustomDialog
                    title="Unblock User"
                    bodyComponent={renderUnblockConfirm}
                    open={openUnblock}
                    handleClose={() => setOpenUnblock(false)}
                  />
                </>
              </div>
            ) : (
              <>
                <MenuItem onClick={handleBlock}>
                  <ListItemIcon>
                    <Cancel fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Block" />
                </MenuItem>
                <CustomDialog
                  title="Block User"
                  bodyComponent={renderBlockConfirm}
                  open={openBlock}
                  handleClose={() => setOpenBlock(false)}
                />
              </>
            )}
          </>
        ) : null}
      </Menu>
    </>
  );
};

export default ActionButton;

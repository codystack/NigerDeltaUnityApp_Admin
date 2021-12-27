import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import EmptyModal from "../modal/EmptyModal";
import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import Fade from "@mui/material/Fade";
// import DataPreview from "../miscellaneous/DataPreview";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import CustomDialog from "../dialogs/custom-dialog";
import DeleteDialog from "../dialogs/custom-dialog";

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

const ActionButton = ({ selected, setIsPerforming, type }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);
  const [openBlock, setOpenBlock] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const openAction = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useSelector((state) => state.user);
  const handleMoreAction = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMoreAction = () => setAnchorEl(null);

  // const { data: scholarData } = useSWR('/applicants/scholars/' + selected.row._id, APIService.authFetcher);

  React.useEffect(() => {
    console.log("DATS: ", userData);
    return () => {
      //   cleanup
    };
  }, []);

  const handlePreview = () => {
    handleCloseMoreAction();
    setOpenPreviewModal(true);
  };

  const handleDelete = () => {
    handleCloseMoreAction();
    setOpenDelete(true);
  };

  const handleBlock = () => {
    setAnchorEl(null);
    setOpenBlock(true);
  };

  const performDelete = async () => {};

  const performBlock = async () => {};

  const renderBlockConfirm = (
    <div className={classes.awardRoot}>
      <Typography>
        {`Are you sure you want to block ${selected.row.firstname} ${selected.row.lastname} from using this platform?`}
      </Typography>
      <div className={classes.awardRow}>
        <Button
          className={classes.button}
          variant="contained"
          color="inherit"
          onClick={() => setOpenBlock(false)}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          style={{ backgroundColor: "red" }}
          onClick={performBlock}
        >
          Block
        </Button>
      </div>
    </div>
  );

  const renderDeleteConfirm = (
    <div className={classes.awardRoot}>
      <Typography>
        {`Are you sure you want to delete ${selected.row.firstname} ${selected.row.lastname} from this platform?`}
      </Typography>
      <div className={classes.awardRow}>
        <Button
          className={classes.button}
          variant="contained"
          color="inherit"
          onClick={() => setOpenBlock(false)}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          style={{ backgroundColor: "red" }}
          onClick={performDelete}
        >
          Block
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
          <ListItemText primary="View Detail" />
        </MenuItem>
        {/* <DataPreview
          open={openPreviewModal}
          setOpen={setOpenPreviewModal}
          data={selected.row}
        /> */}
        {userData && userData?.userType === "super" && selected?.row ? (
          <div>
            <MenuItem onClick={handleBlock}>
              <ListItemText primary="Block user" />
            </MenuItem>
            <CustomDialog
              title="Block User"
              bodyComponent={renderBlockConfirm}
              open={openBlock}
              handleClose={() => setOpenBlock(false)}
            />

            {selected?.row?.userType === "admin" && (
              <div>
                <MenuItem onClick={handleDelete}>
                  <ListItemText primary="Delete user" />
                </MenuItem>
                <DeleteDialog
                  title="Delete Admin"
                  bodyComponent={renderDeleteConfirm}
                  open={openDelete}
                  handleClose={() => setOpenDelete(false)}
                />
              </div>
            )}
          </div>
        ) : null}
      </Menu>
    </>
  );
};

export default ActionButton;

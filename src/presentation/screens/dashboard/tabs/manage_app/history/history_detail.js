import React from "react";
import { Button, Typography } from "@mui/material";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import { useSnackbar } from "notistack";
import {
  deleteDoc,
  deleteObject,
  ref,
  db,
  doc,
  storage,
} from "../../../../../../data/firebase";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    height: 48,
    width: 48,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    padding: 4,
  },
  mb: {
    marginBottom: 10,
  },
}));

const HistoryDetail = (props) => {
  const { history, location } = props;
  const classes = useStyles();

  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const deleteNews = () => {
    setOpenDelete(false);
    const fileRef = ref(storage, "history/" + location?.state?.id);

    deleteObject(fileRef)
      .then(async () => {
        try {
          await deleteDoc(doc(db, "history", "" + location?.state?.id));
          enqueueSnackbar(`Item deleted successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(
            `${error?.message || "Item not deleted. Try again"}`,
            {
              variant: "error",
            }
          );
        }
      })
      .catch((error) => {
        enqueueSnackbar(`${error?.message || "Item not deleted. Try again"}`, {
          variant: "error",
        });
      });
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${location?.state?.title} ?`}
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
          onClick={deleteNews}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  let modules = {
    toolbar: null,
  };

  return (
    <>
      <DeleteDialog
        open={openDelete}
        title="Delete History"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <div className={classes.row}>
        <Button
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => history.goBack()}
        >
          Back
        </Button>

        <div className={classes.lhsRow}>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() =>
              history.push({
                pathname: "/admin/dashboard/manage-app/history/edit",
                state: {
                  id: location?.state?.id,
                  body: location?.state?.body,
                  date: location?.state?.date,
                  image: location?.state?.image,
                  title: location?.state?.title,
                  summary: location?.state?.summary,
                },
              })
            }
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => setOpenDelete(true)}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
      <br />
      {/* Image Section */}
      <div>
        <img
          src={location?.state?.image}
          alt="featured_image"
          width="100%"
          height={400}
        />
      </div>
      <br />

      <Typography
        fontSize={21}
        variant="h6"
        textAlign="center"
        fontWeight="bold"
      >
        {location?.state?.title}
      </Typography>
      <br />

      <div className={classes.lhsRow}>
        <ReactQuill
          value={location?.state?.body}
          readOnly={true}
          modules={modules}
        />
      </div>
      <br />
    </>
  );
};

export default withRouter(HistoryDetail);

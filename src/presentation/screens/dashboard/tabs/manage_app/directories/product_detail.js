import React from "react";
import { Button, Typography } from "@mui/material";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import EditDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
// import EditNewsForm from "../../../../../forms/news/update_news_form";
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
import NumberFormat from "react-number-format";
import { Box } from "@mui/system";
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

const ProductDetail = (props) => {
  const { history, location } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  // const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const deleteProduct = () => {
    setOpenDelete(false);
    const fileRef = ref(
      storage,
      location.state.vendorName + "catalog/" + location?.state?.id
    );

    deleteObject(fileRef)
      .then(async () => {
        // Images deleted now delete from firestore,
        try {
          await deleteDoc(doc(db, "catalogs", "" + location?.state?.id));
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
        {`Are you sure you want to delete ${location?.state?.name} ?`}
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
          onClick={deleteProduct}
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
      <EditDialog
        open={open}
        title="Update Catalog"
        handleClose={() => setOpen(false)}
        // bodyComponent={

        // }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Catalog"
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
          <Typography
            fontSize={21}
            variant="h6"
            textAlign="center"
            fontWeight="bold"
          >
            {location?.state?.name}
          </Typography>
        </div>

        <div className={classes.subRow}>
          <IconButton
            aria-label="gh"
            color="primary"
            onClick={() => setOpen(true)}
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

      <div className={classes.row}>
        <div>
          <Typography>
            Last updated on{" "}
            {`${new Date(
              location?.state?.updatedAt?.seconds * 1000
            ).toLocaleDateString("en-US")}`}
          </Typography>
        </div>
      </div>

      <Box
        display={"flex"}
        fleDirection="row"
        justifyContent={"start"}
        alignItems="center"
        width="100%"
        padding={1}
      >
        <NumberFormat
          value={location?.state?.price}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"₦"}
        />
        <Typography pl={1} fontSize={13}>
          {location?.state?.vendorName + "".toLowerCase().includes("hotel")
            ? "per night"
            : ""}
        </Typography>
      </Box>
      <br />

      <div className={classes.lhsRow}>
        <ReactQuill
          value={location?.state?.desc}
          readOnly={true}
          modules={modules}
        />
      </div>
      <br />
    </>
  );
};

export default withRouter(ProductDetail);

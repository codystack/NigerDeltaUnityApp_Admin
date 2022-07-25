import React from "react";
import { Avatar, Button, Divider, Typography } from "@mui/material";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
// import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
// import { useSnackbar } from "notistack";
// import {
//   deleteDoc,
//   deleteObject,
//   ref,
//   db,
//   doc,
//   storage,
//   query,
//   collection,
//   onSnapshot,
// } from "../../../../../../data/firebase";
// import Delete from "@mui/icons-material/Delete";
// import Edit from "@mui/icons-material/Edit";
import { Add } from "@mui/icons-material";
import AddProductForm from "../../../../../forms/products/add_product";
import Products from "./products";
import { Box } from "@mui/system";

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

const VendorItem = (props) => {
  const { history, location } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  // const [openEdit, setOpenEdit] = React.useState(false);
  // const [openDelete, setOpenDelete] = React.useState(false);
  // const [productList, setProductList] = React.useState(null);
  // const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <CustomDialog
        open={open}
        title="Add Catalog"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <AddProductForm
            setOpen={setOpen}
            vendorID={location?.state?.id}
            vendorName={location?.state?.name}
            vendorPhone={location?.state?.phone}
            vendorAddress={location?.state?.address}
            vendorWebsite={location?.state?.website}
          />
        }
      />

      {/* <DeleteDialog
        open={openDelete}
        title="Delete Product"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      /> */}
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

        <div />
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
        <Typography fontSize={16} variant="h6" textAlign="start" gutterBottom>
          {location?.state?.category}
        </Typography>

        <div>
          <Typography>
            Last updated on{" "}
            {`${new Date(
              location?.state?.updatedAt?.seconds * 1000
            ).toLocaleDateString("en-US")}`}
          </Typography>
        </div>
      </div>

      <Typography fontSize={18} variant="h6" textAlign="start">
        {location?.state?.address}
      </Typography>
      <br />

      <div className={classes.lhsRow}>
        <Typography fontSize={15} variant="h6" textAlign="start">
          {location?.state?.description}
        </Typography>
      </div>
      <br />

      <div className={classes.row}>
        <div>
          <Avatar
            alt="Brand-Logo"
            src={location?.state?.logo}
            className={classes.avatar}
          />
          <Typography
            fontSize={16}
            fontWeight="bold"
            textAlign="start"
            gutterBottom
          >
            {location?.state?.phone}
          </Typography>
          <Typography
            fontSize={16}
            fontWeight="bold"
            textAlign="start"
            gutterBottom
          >
            {location?.state?.website}
          </Typography>
        </div>

        <div>
          {location?.state?.is24hrs ? (
            <Typography>Always open 24/7</Typography>
          ) : (
            <div className={classes.lhsRow}>
              <Typography paddingRight={2}>
                Opens at {`${location?.state?.opensAt}`}
              </Typography>
              <Typography>
                Closes at {`${location?.state?.closesAt}`}
              </Typography>
            </div>
          )}
        </div>
      </div>
      <br />
      <Divider />
      <br />
      <div>
        <Box
          display="flex"
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography
            gutterBottom
            variant="h6"
            fontWeight={700}
            color="#0C0C77"
          >
            Product/Service Catalog
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add Catalog
          </Button>
        </Box>
        <Products vendorID={location?.state?.id} />
      </div>
    </>
  );
};

export default withRouter(VendorItem);

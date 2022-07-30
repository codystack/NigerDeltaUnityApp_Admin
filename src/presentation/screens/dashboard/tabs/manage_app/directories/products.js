import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { CardActionArea, Divider, Typography } from "@mui/material";
import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { Edit } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
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
  where,
} from "../../../../../../data/firebase";
import { useSnackbar } from "notistack";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import EditProjectForm from "../../../../../forms/projects/update_project_form";
import NumberFormat from "react-number-format";
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
    minHeight: 156,
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

const ProductItemCard = (props) => {
  const { image, name, id, item, updatedAt, desc } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const deleteProduct = () => {
    setOpenDelete(false);
    const fileRef = ref(storage, item?.vendorName + "catalog/" + id);

    deleteObject(fileRef)
      .then(async () => {
        try {
          await deleteDoc(doc(db, "catalogs", "" + id));
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
        {`Are you sure you want to delete ${item?.name} ?`}
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

  return (
    <>
      <CustomDialog
        open={open}
        title="Update Item"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <EditProjectForm
            setOpen={setOpen}
            img={image}
            title={item?.name}
            id={id}
            price={item?.price}
            desc={desc}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Product/Service"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3} className={classes.root}>
        <div className={classes.rowHeader}>
          <div className={classes.lhsRow}>
            <div className={classes.column}>
              <Typography variant="body2" fontSize={13}>
                {`${new Date(updatedAt?.seconds * 1000).toLocaleDateString(
                  "en-US"
                )}`}
              </Typography>
            </div>
          </div>
          <div className={classes.subRow}>
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() =>
                history.push({
                  pathname:
                    "/admin/dashboard/manage-app/vendors:" +
                    id +
                    "/products:" +
                    item?.id +
                    "/edit",
                  state: {
                    id: item?.id,
                    name: item?.name,
                    image: item?.image,
                    desc: item?.description,
                    price: item?.price,
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
        <CardActionArea
          onClick={() =>
            history.push({
              pathname:
                "/admin/dashboard/manage-app/vendors:" +
                id +
                "/products:" +
                item?.id,
              state: {
                id: item?.id,
                name: item?.name,
                image: item?.image,
                desc: item?.description,
                price: item?.price,
                vendorName: item?.vendorName,
                vendorID: item?.vendorID,
                createdAt: item?.createdAt,
                updatedAt: item?.updatedAt,
              },
            })
          }
        >
          <CardMedia image={image} className={classes.cardMedia} />
          <Divider />
          <div className={classes.row}>
            <Typography
              pt={1}
              fontSize={18}
              color="black"
              paddingLeft={1}
              textAlign="start"
              fontWeight="bold"
            >
              {name?.length > 75 ? name?.substring(0, 75) + "..." : name}
            </Typography>
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
              value={item?.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₦"}
            />
            <Typography pl={1} fontSize={13}>
              {item?.vendorName + "".toLowerCase().includes("hotel")
                ? "per night"
                : ""}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </>
  );
};

const Products = (props) => {
  const { vendorID } = props;
  const classes = useStyles();
  // const history = useHistory();
  // const [open, setOpen] = React.useState(false);
  const [productsList, setProductsList] = React.useState(null);

  React.useEffect(() => {
    const refs = collection(db, "catalogs");
    const q = query(refs, where("vendorID", "==", vendorID));
    onSnapshot(q, (querySnapshot) => {
      const prod = [];
      querySnapshot.forEach((doc) => {
        prod.push(doc.data());
      });
      setProductsList(prod);
      // console.log("Ve: " + vendorID + " : ", productsList);
    });
    return () => {
      setProductsList([]);
    };
  }, [vendorID]);

  return (
    <div>
      {productsList && (
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {productsList?.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <ProductItemCard
                item={item}
                id={productsList[index]?.id}
                image={productsList[index]?.image}
                name={productsList[index]?.name}
                desc={productsList[index]?.description}
                createdAt={productsList[index]?.createdAt}
                updatedAt={productsList[index]?.updatedAt}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {productsList?.length < 1 && (
        <div className={classes.main}>
          <div style={{ marginTop: "auto" }}>
            <CloudOffIcon fontSize="large" />
            <Typography>No records found</Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

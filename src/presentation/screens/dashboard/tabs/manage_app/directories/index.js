import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { CardActionArea, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import CategoryDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
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
} from "../../../../../../data/firebase";
import { useSnackbar } from "notistack";
import AddNewsForm from "../../../../../forms/news/add_news_form";
import Avatar from "@mui/material/Avatar";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Paper from "@mui/material/Paper";
import DirEditCategoryForm from "../../../../../forms/directories/edit_category";
import DirAddCategoryForm from "../../../../../forms/directories/add_category";
import AddVendorForm from "../../../../../forms/directories/add_vendor";
import EditVendorForm from "../../../../../forms/directories/edit_vendor";

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

const VendorItemCard = (props) => {
  const {
    id,
    image,
    logo,
    name,
    address,
    category,
    phone,
    website,
    description,
    opensAt,
    closesAt,
    is24hrs,
    blocked,
    item,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const deleteVendor = () => {
    setOpenDelete(false);
    const fileRef = ref(storage, "news/" + id);
    const fileRef2 = ref(storage, "news/img_" + id);

    deleteObject(fileRef)
      .then(() => {
        deleteObject(fileRef2)
          .then(async () => {
            // Images deleted now delete from firestore,
            try {
              await deleteDoc(doc(db, "news", "" + id));
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
          .catch((err) => {});
      })
      .catch((error) => {
        console.log("ErR: ", error);
      });
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${name} ?`}
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
          onClick={deleteVendor}
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
        title="Update Vendor"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <EditVendorForm
            setOpen={setOpen}
            img={image}
            id={id}
            logo={logo}
            name={name}
            address={address}
            phone={phone}
            website={website}
            category={category}
            opensAt={opensAt}
            closesAt={closesAt}
            description={description}
            is24hrs={is24hrs}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete News"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3} className={classes.root}>
        <div className={classes.rowHeader}>
          <div className={classes.lhsRow}>
            <Avatar alt="Passport" src={logo} className={classes.avatar} />
            {/* <div className={classes.column}>
              <Typography variant="body2" fontSize={14}>
                {authorName}
              </Typography>
              <Typography variant="body2" fontSize={13}>
                {date}
              </Typography>
            </div> */}
          </div>
          <div className={classes.subRow}>
            <IconButton
              aria-label="delete"
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
        <CardActionArea
          onClick={() =>
            history.push({
              pathname: "/admin/dashboard/manage-app/vendors:" + item?.id,
              state: {
                id: item?.id,
                name: item?.name,
                phone: item?.phone,
                category: item?.category,
                image: item?.image,
                description: item?.description,
                logo: item?.logo,
                address: item?.address,
                website: item?.website,
                blocked: item?.blocked,
                opensAt: item?.opensAt,
                closesAt: item?.closesAt,
                is24hrs: item?.is24hrs,
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
              fontSize={16}
              color="black"
              paddingLeft={1}
              textAlign="start"
              fontWeight="bold"
            >
              {name?.length > 75 ? name?.substring(0, 75) + "..." : name}
            </Typography>
          </div>
          <Typography
            justifyContent="stretch"
            textAlign="left"
            gutterBottom
            fontSize={12}
            color="black"
            paddingLeft={1}
            paddingBottom={1}
          >
            {category}
          </Typography>
          <Typography
            justifyContent="stretch"
            textAlign="left"
            fontSize={14}
            color="black"
            padding={1}
          >
            {description?.length > 150
              ? description?.substring(0, 150) + "..."
              : description}
          </Typography>
        </CardActionArea>
      </Card>
    </>
  );
};

const VendorCategoryCard = (props) => {
  const { id, name, updatedAt } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const deleteItem = async () => {
    setOpenDelete(false);
    try {
      await deleteDoc(doc(db, "directories-categories", "" + id));
      setOpenDelete(false);
      enqueueSnackbar(`Item deleted successfully`, { variant: "success" });
    } catch (error) {
      setOpenDelete(false);
      enqueueSnackbar(`Item not deleted. Try again`, { variant: "error" });
    }
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${name} ?`}
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
          onClick={deleteItem}
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
        title="Update Category"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <DirEditCategoryForm setOpen={setOpen} title={name} id={id} />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Category"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={2}>
        <CardActionArea
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            {name}
          </Typography>
          <div className={classes.subRow}>
            <IconButton
              aria-label="delete"
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
        </CardActionArea>
      </Card>
    </>
  );
};

const Directories = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [openCategory, setOpenCategory] = React.useState(false);
  const [vendorsList, setVendorsList] = React.useState(null);
  const [vendorCategories, setVendorCategories] = React.useState([]);

  React.useEffect(() => {
    const q = query(collection(db, "directories-categories"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setVendorCategories(categories);
    });
  }, []);

  React.useEffect(() => {
    const q = query(collection(db, "directories-vendors"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vendors = [];
      querySnapshot.forEach((doc) => {
        vendors.push(doc.data());
      });
      setVendorsList(vendors);
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Create Vendor"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddVendorForm setOpen={setOpen} />}
      />

      <CategoryDialog
        open={openCategory}
        title="Create Category"
        handleClose={() => setOpenCategory(false)}
        bodyComponent={<DirAddCategoryForm setOpen={setOpenCategory} />}
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography variant="h6" color="blue" fontSize={21}>
            Directories
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          disabled={vendorCategories?.length < 1}
          onClick={() => setOpen(true)}
        >
          Vendor
        </Button>
      </div>
      <br />
      <Paper
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "left",
          alignItems: "stretch",
        }}
      >
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          sx={{ marginRight: 2 }}
          onClick={() => setOpenCategory(true)}
        >
          Category
        </Button>

        {vendorCategories && (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {vendorCategories?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <VendorCategoryCard
                  item={item}
                  id={vendorCategories[index]?.id}
                  name={vendorCategories[index]?.name}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      <div>
        {vendorsList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {vendorsList?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <VendorItemCard
                  item={item}
                  id={vendorsList[index]?.id}
                  image={vendorsList[index]?.image}
                  name={vendorsList[index]?.name}
                  address={vendorsList[index]?.address}
                  phone={vendorsList[index]?.phone}
                  website={vendorsList[index]?.website}
                  opensAt={vendorsList[index]?.opensAt}
                  closesAt={vendorsList[index]?.closesAt}
                  description={vendorsList[index]?.description}
                  createdAt={vendorsList[index]?.createdAt}
                  updatedAt={vendorsList[index]?.updatedAt}
                  category={vendorsList[index]?.category}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {vendorsList?.length < 1 && (
          <div className={classes.main}>
            <div style={{ marginTop: "auto" }}>
              <CloudOffIcon fontSize="large" />
              <Typography>No vendors found</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directories;

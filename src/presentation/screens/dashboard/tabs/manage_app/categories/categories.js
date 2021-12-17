import React from "react";
import { makeStyles, useTheme } from "@mui/styles";
import Button from "@mui/material/Button";
import { Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import CategoryForm from "../../../../../forms/category/new_category_form";
import EditCategoryForm from "../../../../../forms/category/update_category";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { Edit } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { display } from "@mui/system";
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
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

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
}));

const CategoryItem = (props) => {
  const { image, name, id } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const deleteCategory = () => {
    const fileRef = ref(storage, "categories/img_" + id);

    deleteObject(fileRef)
      .then(async () => {
        // File deleted now delete from firestore,
        try {
          await deleteDoc(doc(db, "categories", "img_" + id));
          setOpenDelete(false);
          enqueueSnackbar(`Item deleted successfully`, { variant: "success" });
        } catch (error) {
          setOpenDelete(false);
          enqueueSnackbar(`Item not deleted. Try again`, { variant: "error" });
        }
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
          onClick={deleteCategory}
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
          <EditCategoryForm setOpen={setOpen} img={image} name={name} id={id} />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Category"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3}>
        <CardMedia image={image} className={classes.cardMedia} />
        <Divider />
        <div className={classes.row}>
          <Typography fontSize={18} color="black" padding={1}>
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
        </div>
      </Card>
    </>
  );
};

const Categories = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [categoriesList, setCategoriesList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "categories"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setCategoriesList(categories);
      console.log("Current cities in CA: ", categories);
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Create New Category"
        handleClose={() => setOpen(false)}
        bodyComponent={<CategoryForm setOpen={setOpen} />}
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
            Categories
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Category
        </Button>
      </div>
      <br />
      <div className={classes.main}>
        {categoriesList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {categoriesList?.map((_, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <CategoryItem
                  id={categoriesList[index]?.id}
                  image={categoriesList[index]?.url}
                  name={categoriesList[index].title}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default Categories;

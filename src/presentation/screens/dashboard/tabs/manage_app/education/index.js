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
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Paper from "@mui/material/Paper";
import EduEditCategoryForm from "../../../../../forms/education/edit_category";
import AddEducationForm from "../../../../../forms/education/add_education";
import EduAddCategoryForm from "../../../../../forms/education/add_category";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 320,
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

const EducationCard = (props) => {
  const { id, image, name, category, url, description, item } = props;
  const classes = useStyles();
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const deleteEducation = () => {
    setOpenDelete(false);
    const fileRef = ref(storage, "education/" + id);

    deleteObject(fileRef)
      .then(async () => {
        try {
          await deleteDoc(doc(db, "education", "" + id));
          enqueueSnackbar(`Item deleted successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Item not deleted. Try again`, {
            variant: "error",
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar(`${error?.message || "Check your internet."}`, {
          variant: "error",
        });
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
          onClick={deleteEducation}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <DeleteDialog
        open={openDelete}
        title="Delete Education Listing"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3} className={classes.root}>
        <div className={classes.rowHeader}>
          <div className={classes.subRow}>
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() =>
                history.push({
                  pathname: "/admin/dashboard/manage-app/education/edit",
                  state: {
                    url: url,
                    id: item?.id,
                    image: image,
                    title: item?.title,
                    category: category,
                    description: description,
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
              pathname: "/admin/dashboard/manage-app/education:" + item?.id,
              state: {
                id: item?.id,
                url: item?.url,
                title: item?.title,
                image: image,
                category: item?.category,
                createdAt: item?.createdAt,
                updatedAt: item?.updatedAt,
                description: item?.description,
              },
            })
          }
        >
          <CardMedia image={image} className={classes.cardMedia} />
          <Divider />
          <div className={classes.row}>
            <Typography
              pt={2}
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

const CategoryCard = (props) => {
  const { id, name } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const history = useHistory();

  const deleteItem = async () => {
    setOpenDelete(false);
    try {
      await deleteDoc(doc(db, "education-categories", "" + id));
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
          <EduEditCategoryForm setOpen={setOpen} title={name} id={id} />
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

const Education = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [openCategory, setOpenCategory] = React.useState(false);
  const [educationList, setEducationList] = React.useState(null);
  const [educationCategories, setEducationCategories] = React.useState([]);

  React.useEffect(() => {
    const q = query(collection(db, "education-categories"));
    onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      setEducationCategories(categories);
    });
  }, []);

  React.useEffect(() => {
    const q = query(collection(db, "education"));
    onSnapshot(q, (querySnapshot) => {
      const edu = [];
      querySnapshot.forEach((doc) => {
        edu.push(doc.data());
      });
      setEducationList(edu);
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Create Education Listing"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddEducationForm setOpen={setOpen} />}
      />

      <CategoryDialog
        open={openCategory}
        title="Create Category"
        handleClose={() => setOpenCategory(false)}
        bodyComponent={<EduAddCategoryForm setOpen={setOpenCategory} />}
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
            Education
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          disabled={educationCategories?.length < 1}
          onClick={() => setOpen(true)}
        >
          Education
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

        {educationCategories && (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {educationCategories?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <CategoryCard
                  item={item}
                  id={educationCategories[index]?.id}
                  name={educationCategories[index]?.name}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      <br />
      <div>
        {educationList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {educationList?.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key={index}
                // onClick={() =>
                //   history.push({
                //     pathname:
                //       "/admin/dashboard/manage-app/education:" + item?.id,
                //     state: {
                //       name: educationList[index]?.name,
                //       url: educationList[index]?.url,
                //       image: educationList[index]?.image,
                //       description: educationList[index]?.description,
                //       createdAt: educationList[index]?.createdAt,
                //       updatedAt: educationList[index]?.updatedAt,
                //       category: educationList[index]?.category,
                //       id: educationList[index]?.id,
                //     },
                //   })
                // }
              >
                <EducationCard
                  item={item}
                  id={educationList[index]?.id}
                  image={educationList[index]?.image}
                  name={educationList[index]?.name}
                  url={educationList[index]?.url}
                  description={educationList[index]?.description}
                  createdAt={educationList[index]?.createdAt}
                  updatedAt={educationList[index]?.updatedAt}
                  category={educationList[index]?.category}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {educationList?.length < 1 && (
          <div className={classes.main}>
            <div style={{ marginTop: "auto" }}>
              <CloudOffIcon fontSize="large" />
              <Typography>No data found</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;

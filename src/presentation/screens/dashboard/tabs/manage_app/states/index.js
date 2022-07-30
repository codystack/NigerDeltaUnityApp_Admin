import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { CardActionArea, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
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
} from "../../../../../../data/firebase";
import { useSnackbar } from "notistack";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddStateForm from "../../../../../forms/states/add_state";
import EditStateForm from "../../../../../forms/states/edit_state";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 256,
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

const StateItemCard = (props) => {
  const { image, name, slogan, id } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  //   const history = useHistory();

  const deleteState = () => {
    setOpenDelete(false);
    const fileRef = ref(storage, "states/" + id);

    deleteObject(fileRef)
      .then(async () => {
        try {
          await deleteDoc(doc(db, "states", "" + id));
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
          onClick={deleteState}
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
        title="Update State"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <EditStateForm
            setOpen={setOpen}
            img={image}
            name={name}
            id={id}
            slogan={slogan}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete State"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3} className={classes.root}>
        <CardActionArea>
          <CardMedia image={image} className={classes.cardMedia} />
          <Divider />
          <div className={classes.row}>
            <Typography
              fontSize={18}
              color="black"
              paddingLeft={1}
              textAlign="start"
              fontWeight="bold"
            >
              {name?.length > 75 ? name?.substring(0, 75) + "..." : name}
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

          <Typography
            justifyContent="stretch"
            textAlign="left"
            fontSize={14}
            color="black"
            padding={1}
          >
            {slogan?.length > 150 ? slogan?.substring(0, 150) + "..." : slogan}
          </Typography>
        </CardActionArea>
      </Card>
    </>
  );
};

const State = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [stateList, setStateList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "states"));
    onSnapshot(q, (querySnapshot) => {
      const state = [];
      querySnapshot.forEach((doc) => {
        state.push(doc.data());
      });
      setStateList(state);
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add State"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddStateForm setOpen={setOpen} />}
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
            States
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add State
        </Button>
      </div>
      <br />
      <div>
        {stateList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {stateList?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <StateItemCard
                  item={item}
                  id={stateList[index]?.id}
                  image={stateList[index]?.image}
                  name={stateList[index]?.name}
                  slogan={stateList[index]?.slogan}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {stateList?.length < 1 && (
          <div className={classes.main}>
            <div style={{ marginTop: "auto" }}>
              <CloudOffIcon fontSize="large" />
              <Typography>No records found</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default State;

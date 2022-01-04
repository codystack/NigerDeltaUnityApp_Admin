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
import AddHistoryForm from "../../../../../forms/history/add_history_form";
import EditHistoryForm from "../../../../../forms/history/update_history_form";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 275,
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

const HistoryItemCard = (props) => {
  const { image, title, id, body, summary, item } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const deleteNews = () => {
    setOpenDelete(false);
    const fileRef = ref(storage, "history/" + id);

    deleteObject(fileRef)
      .then(async () => {
        try {
          await deleteDoc(doc(db, "history", "" + id));
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
        {`Are you sure you want to delete ${title} ?`}
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

  return (
    <>
      <CustomDialog
        open={open}
        title="Update History"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <EditHistoryForm
            setOpen={setOpen}
            img={image}
            title={title}
            id={id}
            body={body}
            summary={summary}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete History"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3} className={classes.root}>
        <div className={classes.rowHeader}>
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
              pathname: "/admin/dashboard/manage-app/history:" + item?.id,
              state: {
                title: item?.title,
                image: item?.image,
                body: item?.body,
                summary: item?.summary,
                date: item?.createdAt,
                id: item?.id,
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
              {title?.length > 75 ? title?.substring(0, 75) + "..." : title}
            </Typography>
          </div>
        </CardActionArea>
      </Card>
    </>
  );
};

const History = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [historyList, setHistoryList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "history"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const hist = [];
      querySnapshot.forEach((doc) => {
        let dat = doc.data();
        hist?.push(dat);
      });
      setHistoryList(hist);
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add History"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddHistoryForm setOpen={setOpen} />}
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
            History
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add History
        </Button>
      </div>
      <br />
      <div>
        {historyList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {historyList?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <HistoryItemCard
                  item={item}
                  id={historyList[index]?.id}
                  image={historyList[index]?.image}
                  title={historyList[index]?.title}
                  body={historyList[index]?.body}
                  summary={historyList[index]?.summary}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {historyList?.length < 1 && (
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

export default History;

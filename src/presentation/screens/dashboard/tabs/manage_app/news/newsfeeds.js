import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { CardActionArea, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import DeleteDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import EditNewsForm from "../../../../../forms/news/update_news_form";
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
// import AddNewsForm from "../../../../../forms/news/add_news_form";
import Avatar from "@mui/material/Avatar";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

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
    minHeight: 275,
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

const NewsItemCard = (props) => {
  const {
    image,
    title,
    id,
    authorName,
    authorPhoto,
    body,
    date,
    category,
    item,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const deleteNews = () => {
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
        title="Update News"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <EditNewsForm
            setOpen={setOpen}
            img={image}
            title={title}
            id={id}
            authorName={authorName}
            authorPhoto={authorPhoto}
            body={body}
            category={category}
            date={date}
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
            <Avatar
              alt="Passport"
              src={authorPhoto}
              className={classes.avatar}
            />
            <div className={classes.column}>
              <Typography variant="body2" fontSize={14}>
                {authorName}
              </Typography>
              <Typography variant="body2" fontSize={13}>
                {date}
              </Typography>
            </div>
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
              pathname: "/admin/dashboard/manage-app/news-feeds:" + item?.id,
              state: {
                title: item?.title,
                category: item?.category,
                image: item?.image,
                body: item?.body,
                authorName: item?.authorName,
                authorPhoto: item?.authorPhoto,
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
        </CardActionArea>
      </Card>
    </>
  );
};

const NewsFeeds = () => {
  const classes = useStyles();
  const history = useHistory();
  // const [open, setOpen] = React.useState(false);
  const [newsList, setNewsList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "news"));
    onSnapshot(q, (querySnapshot) => {
      const news = [];
      querySnapshot.forEach((doc) => {
        let dat = doc.data();
        news?.push(dat);
      });
      setNewsList(news);
    });
  }, []);

  return (
    <div>
      {/* <CustomDialog
        open={open}
        title="Create NewsFeed"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddNewsForm setOpen={setOpen} />}
      /> */}
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography variant="h6" color="blue" fontSize={21}>
            News Feeds
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() =>
            history.push("/admin/dashboard/manage-app/news-feeds/create")
          }
        >
          Add News
        </Button>
      </div>
      <br />
      <div>
        {newsList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {newsList?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <NewsItemCard
                  item={item}
                  id={newsList[index]?.id}
                  image={newsList[index]?.image}
                  title={newsList[index]?.title}
                  authorName={newsList[index]?.authorName}
                  authorPhoto={newsList[index]?.authorPhoto}
                  body={newsList[index]?.body}
                  category={newsList[index]?.category}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {newsList?.length < 1 && (
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

export default NewsFeeds;

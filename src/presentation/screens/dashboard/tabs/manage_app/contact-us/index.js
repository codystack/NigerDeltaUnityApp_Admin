import React from "react";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  ArrowBackIosNew,
  Edit,
  Email,
  Facebook,
  Instagram,
  Phone,
  Web,
} from "@mui/icons-material";
import image from "../../../../../../assets/images/handshake.jpeg";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import { onSnapshot, db, doc } from "../../../../../../data/firebase";
import CustomDialog from "../../../../../components/dashboard/dialogs/custom-dialog";
import UpdateContactUsForm from "../../../../../forms/contact-us";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
  },
  header: {
    height: 286,
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowStart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
}));

const ContactUs = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [contactsData, setContactsData] = React.useState(null);

  React.useEffect(() => {
    onSnapshot(doc(db, "others", "contact-us"), (doc) => {
      //   console.log("Current data: ", doc.data());
      setContactsData(doc.data());
    });
  }, []);

  return (
    <div>
      <CustomDialog
        title="Update Contact Info"
        open={open}
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateContactUsForm
            setOpen={setOpen}
            phone={contactsData?.phone}
            email={contactsData?.email}
            website={contactsData?.website}
            facebook={contactsData?.facebook}
            instagram={contactsData?.instagram}
          />
        }
      />
      <div className={classes.row}>
        <Button
          variant="text"
          startIcon={<ArrowBackIosNew />}
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        <Typography variant="h5" color="goldenrod">
          Contact Us
        </Typography>
        <Button
          startIcon={<Edit />}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Edit
        </Button>
      </div>
      <br />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={7}>
          {contactsData && (
            <>
              <Typography gutterBottom align="left" fontSize={13}>
                Last updated on{" "}
                {`${new Date(
                  contactsData?.updatedAt?.seconds * 1000
                ).toLocaleDateString("en-US")}`}
              </Typography>
              <br />
              <div className={classes.rowStart}>
                <Phone fontSize="large" />
                <Typography sx={{ ml: 2 }} gutterBottom>
                  {contactsData?.phone}
                </Typography>
              </div>

              <div className={classes.rowStart}>
                <Email fontSize="large" />
                <Typography sx={{ ml: 2 }} gutterBottom>
                  {contactsData?.email}
                </Typography>
              </div>

              <div className={classes.rowStart}>
                <Web fontSize="large" />
                <Typography sx={{ ml: 2 }} gutterBottom align="justify">
                  {contactsData?.website}
                </Typography>
              </div>

              <div className={classes.rowStart}>
                <Facebook fontSize="large" />
                <Typography sx={{ ml: 2 }} gutterBottom align="justify">
                  {contactsData?.facebook}
                </Typography>
              </div>

              <div className={classes.rowStart}>
                <Instagram fontSize="large" />
                <Typography sx={{ ml: 2 }} gutterBottom align="justify">
                  {contactsData?.instagram}
                </Typography>
              </div>
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <div>
            <img src={image} alt="featured-img" width="100%" />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContactUs;

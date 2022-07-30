import React from "react";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ArrowBackIosNew, Edit } from "@mui/icons-material";
import image from "../../../../../../assets/images/terms_of_service.jpeg";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import { onSnapshot, db, doc } from "../../../../../../data/firebase";
import ReactQuill from "react-quill";

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
}));

const TermsOfService = () => {
  const classes = useStyles();
  const history = useHistory();
  const [termsData, setTermsData] = React.useState(null);

  React.useEffect(() => {
    onSnapshot(doc(db, "others", "terms"), (doc) => {
      setTermsData(doc.data());
    });
  }, [termsData]);

  let modules = {
    toolbar: null,
  };

  return (
    <div>
      <div className={classes.row}>
        <Button
          variant="text"
          startIcon={<ArrowBackIosNew />}
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        <Typography variant="h5" color="goldenrod">
          Terms Of Service
        </Typography>
        <Button
          startIcon={<Edit />}
          variant="contained"
          onClick={() =>
            history.push({
              pathname: "/admin/dashboard/manage-app/terms-of-service/edit",
              state: {
                body: termsData?.body,
              },
            })
          }
        >
          Edit
        </Button>
      </div>
      <br />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <div>
            <img src={image} alt="featured-img" width="45%" />
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          {termsData && (
            <>
              <Typography gutterBottom align="left" fontSize={13}>
                Last updated on{" "}
                {`${new Date(
                  termsData?.updatedAt?.seconds * 1000
                ).toLocaleDateString("en-US")}`}
              </Typography>
              <ReactQuill
                value={termsData?.body}
                readOnly={true}
                modules={modules}
              />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default TermsOfService;

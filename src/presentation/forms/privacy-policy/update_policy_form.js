import React from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import { db, doc, updateDoc } from "../../../data/firebase/";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/system/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useHistory, useLocation } from "react-router-dom";
import QuillEditable from "../../components/misc/richtext/edit_quill";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";

const UpdatePolicyForm = () => {
  const location = useLocation();
  const history = useHistory();
  let { body } = location?.state;

  const [isLoading, setIsLoading] = React.useState(false);
  const [policyData, setPolicyData] = React.useState(body);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const updatePolicy = async (e) => {
    setIsLoading(true);

    //   console.log("ID: ", id);
    const timeNow = new Date();
    const mRef = doc(db, "others", "privacy");
    try {
      await updateDoc(mRef, {
        body: policyData,
        updatedAt: timeNow,
      });
      setIsLoading(false);
      enqueueSnackbar(`Privacy policy updated successfully`, {
        variant: "success",
      });
      history.goBack();
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(
        `${error?.message || "Check your internet connection!"}`,
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
        {isLoading ? (
          <CircularProgress
            size={90}
            thickness={3.0}
            style={{ color: "white" }}
          />
        ) : (
          <div />
        )}
      </Backdrop>
      <ValidatorForm onSubmit={updatePolicy}>
        <Box
          width={"100%"}
          display="flex"
          flexDirection="row"
          justifyContent="start"
          alignItems={"start"}
          paddingBottom={2}
        >
          <Button
            disableElevation
            variant="text"
            startIcon={<ArrowBackIosNew />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography px={4} variant="h6">
            Update Privacy Policy
          </Typography>
        </Box>
        <QuillEditable setValue={setPolicyData} value={policyData} />
        <br />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Now
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdatePolicyForm;

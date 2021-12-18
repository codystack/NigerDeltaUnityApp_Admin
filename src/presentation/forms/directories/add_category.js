import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import { db, setDoc, doc } from "../../../data/firebase/";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";

const DirAddCategoryForm = (props) => {
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const createCategory = (e) => {
    const timeNow = new Date();
    setIsLoading(true);
    setDoc(doc(db, "directories-categories", `${timeNow.getTime()}`), {
      id: timeNow.getTime(),
      name: formValues.title,
      createdAt: timeNow,
      updatedAt: timeNow,
    })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`New category added successfully`, {
          variant: "success",
        });
      })
      .catch((error) => {
        setIsLoading(false);
      });
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
      <ValidatorForm onSubmit={createCategory}>
        <TextValidator
          id="title"
          label="Category name"
          size="small"
          variant="outlined"
          value={formValues.title}
          onChange={handleChange}
          // onBlur={handleBlur}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["Category name is required"]}
        />

        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Save
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default DirAddCategoryForm;

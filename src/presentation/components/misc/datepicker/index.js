import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function DatePicker(props) {
  const { id, value, label, setFormData } = props;

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: new Date(date).toDateString(),
    }));
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="normal"
        id={id}
        label={label}
        openTo="year"
        format="dd/MM/yyyy"
        views={["year", "month", "date"]}
        variant="inline"
        inputVariant="outlined"
        size="small"
        InputAdornmentProps={{ position: "start" }}
        value={value}
        onChange={handleDateChange}
        fullWidth
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

import "date-fns";
import React from "react";
// import DateFnsUtils from "@date-io/date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";

export default function DatePicker(props) {
  const { id, value, label, setFormData } = props;

  const handleChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: new Date(date).toDateString(),
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* <KeyboardDatePicker
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
      /> */}
      <DesktopDatePicker
        label={label}
        inputFormat="MM/dd/yyyy"
        value={value}
        closeOnSelect={true}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} size="small" fullWidth />
        )}
      />
    </LocalizationProvider>
  );
}

import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        my: "auto",
        height: "100vh",
      }}
    >
      <Typography variant="h6">Page not found</Typography>
    </Box>
  );
};

export default NotFound;

import Typography from "@mui/material/Typography";
import React from "react";
import AdminsTable from "../../../../components/dashboard/table/admin/";

const AdminUsers = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        <Typography
          textTransform={"uppercase"}
          variant="h4"
          fontWeight="700"
          color="primary.main"
        >
          ADMIN USERS
        </Typography>
      </div>
      <br />
      <AdminsTable />
    </div>
  );
};

export default AdminUsers;

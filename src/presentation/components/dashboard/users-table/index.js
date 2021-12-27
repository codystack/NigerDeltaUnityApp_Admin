import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
// import { useDemoData } from "@mui/x-data-grid-generator";
import {
  onSnapshot,
  query,
  where,
  collection,
  db,
} from "../../../../data/firebase";
import Avatar from "@mui/material/Avatar";
import CustomNoRowsOverlay from "../../misc/placeholder/custom_no_data";
import ActionButton from "./action_button";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function UserTable() {
  const columns = [
    {
      field: "photo",
      headerName: "Image",
      width: 75,
      renderCell: (params) => (
        <Avatar alt="Profile Picture" src={params.value} />
      ),
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstname || ""} ${params.row.lastname || ""}`,
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 165,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 128,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 86,
    },
    {
      field: "state",
      headerName: "State of Origin",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 96,
    },
    {
      field: "id",
      headerName: "ACTIONS",
      width: 130,
      renderCell: (params) => {
        return (
          <ActionButton
            selected={params}
            type="scholars"
            // setIsPerforming={setIsPerforming}
            // handleSetSelectedRow={props.handleSetSelectedRow}
          />
        );
      },
    },
  ];

  // const { data } = useDemoData({
  //   dataSet: "Commodity",
  //   rowLength: 10,
  //   maxColumns: 6,
  // });

  const [usersList, setUsersList] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userType", "==", "public"));
    onSnapshot(q, (querySnapshot) => {
      const usrs = [];
      querySnapshot.forEach((doc) => {
        usrs.push(doc.data());
      });
      setUsersList(usrs);
    });
    return () => {
      setUsersList([]);
    };
  }, []);

  if (usersList) {
    console.log("Filtered: ", usersList);
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        // {...data}
        rows={usersList}
        columns={columns}
        components={{
          Toolbar: CustomToolbar,
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
      />
    </div>
  );
}

import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import {
  onSnapshot,
  query,
  where,
  collection,
  db,
} from "../../../../../data/firebase/";
import CustomNoRowsOverlay from "../../../misc/placeholder/custom_no_data";
import ActionButton from "./action_button";
import avatar from "../../../../../assets/images/user_avtr.svg";

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

export default function AdminsTable() {
  const columns = [
    {
      field: "photo",
      headerName: "Image",
      width: 75,
      renderCell: (params) => <img alt="Profile" src={avatar} width="50%" />,
    },
    {
      field: "name",
      headerName: "NAME",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 180,
      valueGetter: (params) =>
        `${params.row?.name || params.row?.firstname} ${
          params.row?.lastname || ""
        }`,
    },
    {
      field: "email",
      headerName: "EMAIL ADDRESS",
      width: 210,
    },
    {
      field: "phone",
      headerName: "PHONE",
      width: 135,
    },
    {
      field: "userType",
      headerName: "ROLE",
      width: 100,
      valueGetter: (params) => `${params.row?.userType || ""}`,
    },
    {
      field: "createdAt",
      headerName: "CREATED ON",
      width: 136,
      valueGetter: (params) =>
        `${new Date(params?.row?.createdAt?.seconds * 1000).toLocaleDateString(
          "en-US"
        )}`,
    },
    {
      field: "id",
      headerName: "ACTIONS",
      width: 130,
      renderCell: (params) => {
        return <ActionButton selected={params} />;
      },
    },
  ];

  const [usersList, setUsersList] = React.useState(null);

  React.useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userType", "!=", "public"));
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

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
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

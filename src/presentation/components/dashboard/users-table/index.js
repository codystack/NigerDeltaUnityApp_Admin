import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridColumnsToolbarButton,
  GridFilterToolbarButton,
  GridToolbarExport,
} from "@mui/";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import TimeAgo from "../../countdown/timeago";
import ActionButton from "../../button/ActionButton";
import CustomNoRowsOverlay from "../../skeleton/CustomNoRowsOverlay";
import { useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const CustomToolbar = () => {
  const theme = useTheme();

  return (
    <GridToolbarContainer
      color="secondary"
      style={{
        display: "flex",
        padding: 16,
      }}
    >
      <Paper style={{ padding: 6, borderRadius: 10 }}>
        <GridColumnsToolbarButton />
      </Paper>
      <Paper
        style={{ padding: 6, borderRadius: 10, marginLeft: 5, marginRight: 5 }}
      >
        <GridFilterToolbarButton />
      </Paper>
      <Paper
        style={{
          alignSelf: "flex-end",
          padding: 6,
          marginLeft: "auto",
          borderRadius: 10,
        }}
      >
        <GridToolbarExport />
      </Paper>
    </GridToolbarContainer>
  );
};

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => res.data);

export default function UsersTable({ setIsPerforming }) {
  const [filterData, setfilterData] = React.useState([]);
  const [isLoading, setIsloading] = React.useState(true);

  // const { data } = useSWR('/applicants/scholars/all', fetcher);

  // React.useEffect(() => {
  //     if (data) {
  //         setIsloading(false);
  //         setfilterData(data.map(item => ({ id: item._id, ...item, ...item.Details })))
  //     }
  // }, [data])

  return (
    <div style={{ height: 520, width: "100%" }}>
      <DataGrid
        columns={[
          {
            field: "Passport",
            headerName: "PASSPORT",
            width: 100,
            renderCell: (params) => (
              <Avatar alt="Profile Picture" src={params.value} />
            ),
          },
          {
            field: "Name",
            headerName: "FULL NAME",
            width: 200,
            sortable: false,
            valueGetter: (params) =>
              `${params.getValue("First_Name") || ""} ${
                params.getValue("Surname") || ""
              }`,
          },
          { field: "Phone_Number", headerName: "PHONE NUMBER", width: 180 },
          { field: "Email_Address", headerName: "EMAIL ADDRESS", width: 180 },
          // {
          //     field: "Gender",
          //     headerName: "GENDER",
          // },
          // {
          //     field: "Community",
          //     headerName: "COMMUNITY",
          //     width: 150,
          // },
          {
            field: "Created_At",
            headerName: "DATE",
            type: "date",
            renderCell: (params) => {
              return <TimeAgo dateString={params.value} variant="body1" />;
            },
          },

          {
            field: "id",
            headerName: "ACTIONS",
            width: 130,
            renderCell: (params) => {
              return (
                <ActionButton
                  selected={params}
                  setIsPerforming={setIsPerforming}
                  // handleSetSelectedRow={props.handleSetSelectedRow}
                />
              );
            },
          },
        ]}
        rows={filterData}
        density="comfortable"
        loading={isLoading}
        rowHeight={45}
        pagination
        // rowCount={data?.total}
        paginationMode="client"
        disableSelectionOnClick={true}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}

import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import avatar from "../../../../../assets/images/user_avtr.svg";

const AdminsPreview = (props) => {
  let { item, setOpen } = props;

  return (
    <div>
      <Container sx={{ paddingY: 2 }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          pb={2}
        >
          <img alt="Profile" src={avatar} width="50%" />
          <br />
          <Typography>{`${item?.firstname} ${item?.lastname}`}</Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"start"}
          alignItems="start"
          paddingBottom={1}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography pr={2} fontWeight="600">
              EMAIL
            </Typography>
            <Typography>{item?.email}</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography pr={2} fontWeight="600">
              PHONE
            </Typography>
            <Typography>{item?.phone}</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography pr={2} fontWeight="600">
              ROLE
            </Typography>
            <Typography>{item?.userType}</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography pr={2} fontWeight="600">
              CREATED ON
            </Typography>
            <Typography>{`${new Date(
              item?.createdAt?.seconds * 1000
            ).toLocaleDateString("en-US")}`}</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography pr={2} fontWeight="600">
              LAST UPDATED ON
            </Typography>
            <Typography>{`${new Date(
              item?.updatedAt?.seconds * 1000
            ).toLocaleDateString("en-US")}`}</Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={"row"}
          justifyContent="end"
          alignItems="end"
          pt={2}
        >
          <Button variant="contained" onClick={() => setOpen(false)}>
            Done
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default AdminsPreview;

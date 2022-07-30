import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import avatar from "../../../../../assets/images/user_avtr.svg";

const UsersPreview = (props) => {
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
          <img
            alt="Profile"
            src={avatar}
            width="50%"
            style={{ color: "pink" }}
          />
          <br />
          <Typography>{item?.name}</Typography>
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
              GENDER
            </Typography>
            <Typography>{item?.gender}</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography pr={2} fontWeight="600">
              PLATFORM
            </Typography>
            <Typography>{item?.osPlatform}</Typography>
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

export default UsersPreview;

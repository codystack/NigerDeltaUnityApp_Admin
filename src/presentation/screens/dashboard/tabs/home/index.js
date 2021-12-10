import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { NewspaperOutlined } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  button: {
    textTransform: "none",
    fontSize: 11,
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.only("xs"));
  const medium = useMediaQuery(theme.breakpoints.only("sm"));

  if (small) {
    return (
      <div>
        <Grid container spacing={1}>
          <Grid xs={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid xs={12}>
            <Card sx={{ mb: 3, mt: 3 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <NewspaperOutlined style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total News Feeds</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  } else if (medium) {
    return (
      <div>
        <Grid container spacing={1}>
          <Grid xs={6}>
            <Card sx={{ m: 2 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid sm={6}></Grid>
        </Grid>
      </div>
    );
  } else {
    return (
      <div>
        <Grid container spacing={1}>
          <Grid sm={4}>
            <Card sx={{ m: 1 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid sm={4}>
            <Card sx={{ m: 1 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid sm={4}>
            <Card sx={{ m: 1 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid sm={4}>
            <Card sx={{ m: 1 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography> Vendors 10</Typography>

                    <Button
                      className={classes.button}
                      variant="text"
                      onClick={() => {}}
                    >
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid sm={4}>
            <Card sx={{ m: 1 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="text" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid sm={4}>
            <Card sx={{ m: 1 }}>
              <CardActionArea>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonOutline style={{ width: 100, height: 128 }} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Total Users</Typography>
                      <Typography>10</Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions>
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="text" onClick={() => {}}>
                      View All
                    </Button>
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default HomePage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import data from "../assets/BHR.json";

import { Avatar, Card, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { HOSTEL, HOSTEL_NAME, SERVER_URL } from "../constants";

const useStyles = makeStyles({
  cntsnt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    cursor: "pointer",
    transition: "200ms all ease-in-out",
    transform: "scale(1)",
    marginBottom: "20px",
    boxShadow: "0px 0px 10px 2px rgb(0,0,0,0.1)",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "blue",
    },
  },
  image: {
    "& img": {
      objectFit: "contain !important",
    },
  },
});

const Home = ({ user }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [contestants, setContestants] = useState(null);
  const [choices, setChoices] = useState({});
  const [page, setPage] = useState(0);

  const vote = () => {
    axios
      .post(`${SERVER_URL}/hostel/vote`, {
        hostel: HOSTEL,
        tokenId: user.token,
        ...choices,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) navigate("/200");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let posts = {};

  contestants?.forEach((el) => {
    const positions = [];

    positions.push(el.position + "1");
    if (data.double.includes(el.position)) positions.push(el.position + "2");

    positions.forEach((pos) => {
      if (!posts[pos]) posts[pos] = [];
      posts[pos].push(el);
    });
  });

  useEffect(() => {
    if (!contestants) setContestants(data?.contestants);
  }, [contestants]);

  useEffect(() => {
    console.log({ choices });
  }, [choices]);

  const showFullName = (post) => {
    switch (post) {
      case "gsec":
        return "General Secretary";
      case "msec":
        return "Mess Secretary";
      case "msec1":
        return "Mess Secretary - 1";
      case "msec2":
        return "Mess Secretary - 2";
      case "hsec":
        return "Health and Hygeine Secretary";
      default:
        return "Post";
    }
  };

  return (
    <div style={{ padding: "2%" }}>
      <Typography
        variant="h3"
        style={{
          marginBottom: "2%",
          letterSpacing: "3px",
        }}
      >
        Hostel Elections
      </Typography>
      <Typography
        variant="h5"
        style={{
          marginBottom: "4%",
        }}
      >
        {HOSTEL_NAME}
      </Typography>

      <div>
        {Object.entries(posts)
          ?.sort((a, b) => a[0] - b[0])
          .filter((post, index) => index === page)
          .map((post, index) => {
            return (
              <div key={"post-" + index} style={{ margin: "20px" }}>
                <Card
                  style={{
                    padding: "30px",
                    boxShadow: "0px 0px 10px 2px rgb(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="h6" style={{ marginBottom: "20px" }}>
                    {showFullName(post[0])}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      padding: "20px 0px",
                      flexWrap: "wrap",
                    }}
                  >
                    {post[1].map((cnt) => {
                      return (
                        <Card
                          className={classes.cntsnt}
                          style={{
                            width: "120px",
                            backgroundColor:
                              choices[post[0]] === cnt.email
                                ? "rgb(107, 209, 249,0.4)"
                                : "inherit",
                            filter:
                              post[0] === "msec2" &&
                              choices["msec1"] === cnt.email
                                ? "opacity(0.4)"
                                : "opacity(1)",
                          }}
                          key={"contestant-" + cnt.email}
                          onClick={() => {
                            if (
                              post[0] === "msec2" &&
                              choices["msec1"] === cnt.email
                            )
                              return;
                            if (
                              post[0] === "msec1" &&
                              choices["msec2"] === cnt.email
                            )
                              setChoices({
                                ...choices,
                                [post[0]]: cnt.email,
                                msec2: undefined,
                              });
                            else
                              setChoices({ ...choices, [post[0]]: cnt.email });
                          }}
                        >
                          <Avatar
                            style={{
                              height: "80px",
                              width: "80px",
                            }}
                            className={classes.image}
                            src={
                              "/images/" +
                              cnt.email.split("@iitbbs.ac.in")[0] +
                              ".jpg"
                            }
                          />
                          {cnt.name}
                        </Card>
                      );
                    })}
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Card
                      style={{
                        padding: "10px 20px",
                        boxShadow: "0px 0px 10px 2px rgb(0,0,0,0.1)",
                        cursor: "pointer",
                        backgroundColor:
                          choices[post[0]] === "NOTA"
                            ? "rgb(107, 209, 249,0.4)"
                            : "inherit",
                      }}
                      onClick={() => {
                        setChoices({ ...choices, [post[0]]: "NOTA" });
                      }}
                    >
                      None of the Above
                    </Card>
                    <Card
                      style={{
                        padding: "10px 20px",
                        boxShadow: "0px 0px 10px 2px rgb(0,0,0,0.1)",
                        cursor: "pointer",
                        backgroundColor:
                          choices[post[0]] === "AFV"
                            ? "rgb(107, 209, 249,0.4)"
                            : "inherit",
                      }}
                      onClick={() => {
                        setChoices({ ...choices, [post[0]]: "AFV" });
                      }}
                    >
                      Abstain from Voting
                    </Card>
                  </div>
                </Card>
                <div
                  style={{
                    position: "relative",
                    marginTop: "20px",
                  }}
                >
                  {page !== 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ position: "absolute", left: "0px" }}
                      onClick={() => {
                        setPage(page - 1);
                      }}
                    >
                      ⬅️ BACK
                    </Button>
                  )}
                  {page !== Object.entries(posts).length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ position: "absolute", right: "0px" }}
                      onClick={() => {
                        setPage(page + 1);
                      }}
                      disabled={!choices[post[0]]}
                    >
                      NEXT ➡️
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ position: "absolute", right: "0px" }}
                      onClick={() => {
                        vote();
                      }}
                      disabled={!choices[post[0]]}
                    >
                      SUBMIT
                    </Button>
                  )}
                  <br />
                  <br />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;

import { useState, useEffect } from "react";
import data from "../BHR.json";

import { Avatar, Card, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
});

const Home = () => {
  const classes = useStyles();

  const [contestants, setContestants] = useState(null);
  const [choices, setChoices] = useState({});
  const [page, setPage] = useState(0);

  let posts = {};

  contestants?.forEach((el) => {
    if (!posts[el.position]) posts[el.position] = [];
    posts[el.position].push(el);
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
      case "hsec":
        return "Health and Hygeine Secretary";
      default:
        return "Post";
    }
  };

  return (
    <div>
      <Typography variant="h3">BHR ELECTIONS</Typography>
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
                            backgroundColor:
                              choices[post[0]] === cnt.email
                                ? "rgb(107, 209, 249,0.4)"
                                : "inherit",
                          }}
                          key={"contestant-" + cnt.email}
                          onClick={() => {
                            setChoices({ ...choices, [post[0]]: cnt.email });
                          }}
                        >
                          <Avatar
                            style={{ height: "60px", width: "60px" }}
                            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
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
                        alert("write code to submit");
                        console.log(choices);
                      }}
                      disabled={!choices[post[0]]}
                    >
                      SUBMIT
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;

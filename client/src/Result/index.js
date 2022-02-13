import { useState, useEffect } from "react";
import { Card, Typography } from "@mui/material";
import ResultTable from "./resultTable.js";
import axios from "axios";
import { HOSTEL, HOSTEL_NAME, SERVER_URL } from "../constants";

const Resultpage = ({ user }) => {
  const [hostelResults, setHostelResults] = useState({});
  useEffect(() => {
    axios
      .post(`${SERVER_URL}/hostel/results`, {
        tokenId: user.token,
        hostel: HOSTEL,
      })
      .then((response) => {
        setHostelResults({
          gsec: response.data.hostel.gsec,
          hsec: response.data.hostel.hsec,
          msec1: response.data.hostel.msec1,
          msec2: response.data.hostel.msec2,
        });
        
      });
    // setHostelResults({
    //     gsec : {
    //         nota : 10,
    //         abstain : 20,
    //         contestants :  [
    //             {
    //                 name : "Salman khan",
    //                 email : "bigboss@iitbbs.ac.in",
    //                 votes : 340
    //             },
    //             {
    //                 name : "Shahrukh khan",
    //                 email : "loveking@iitbbs.ac.in",
    //                 votes : 300
    //             }
    //         ]
    //     },
    //     msec1 : {
    //         nota : 20,
    //         abstain : 30,
    //         contestants :  [
    //             {
    //                 name : "Aamir khan",
    //                 email : "dangal@iitbbs.ac.in",
    //                 votes : 420
    //             },
    //             {
    //                 name : "Sher khan",
    //                 email : "conqueror@iitbbs.ac.in",
    //                 votes : 120
    //             }
    //         ]
    //     },
    //     msec2 : {
    //         nota : 5,
    //         abstain : 15,
    //         contestants :  [
    //             {
    //                 name : "Hrithik",
    //                 email : "greekgod@iitbbs.ac.in",
    //                 votes : 430
    //             },
    //             {
    //                 name : "Tiger",
    //                 email : "stuntdude@iitbbs.ac.in",
    //                 votes : 200
    //             },
    //             {
    //                 name : "vidyuth",
    //                 email : "electricity@iitbbs.ac.in",
    //                 votes : 700
    //             }
    //         ]
    //     },
    //     hsec : {
    //         nota : 10,
    //         abstain : 25,
    //         contestants :  [
    //             {
    //                 name : "ranveer",
    //                 email : "dragqueen@iitbbs.ac.in",
    //                 votes : 200
    //             },
    //             {
    //                 name : "ranbir",
    //                 email : "sanju@iitbbs.ac.in",
    //                 votes : 400
    //             },
    //             {
    //                 name : "No offense",
    //                 email : "jff@iitbbs.ac.in",
    //                 votes : 300
    //             }
    //         ]
    //     },
    // })
  }, []);

  const showFullName = (post) => {
    switch (post) {
      case "gsec":
        return "General Secretary";
      case "msec1":
        return "Mess Secretary 1";
      case "msec2":
        return "Mess Secretary 2";
      case "hsec":
        return "Health and Hygeine Secretary";
      default:
        return "Post";
    }
  };

  return (
    <div>
      <Typography
        variant="h3"
        style={{
          marginBottom: "2%",
          letterSpacing: "3px",
        }}
      >
        Hostel Election Results
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
        {Object.entries(hostelResults)
          ?.sort((a, b) => a[0] - b[0])
          .map((post, index) => {
            return (
              <div key={index} style={{ margin: "10px" }}>
                <Typography variant="h6" style={{ marginBottom: "20px" }}>
                  {showFullName(post[0])}
                </Typography>
                <ResultTable postResults={post[1]} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Resultpage;

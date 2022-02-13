import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { Button, CircularProgress, SvgIcon } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { CLIENT_ID, HOSTEL, HOSTEL_NAME, SERVER_URL } from "../constants";
import "./style.css";

const Login = ({ user, updateUser }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const successResponseGoogle = (res) => {
    const curr = {
      firstName: res.profileObj.givenName,
      lastName: res.profileObj.familyName,
      email: res.profileObj.email,
      image: res.profileObj.imageUrl,
      token: res.tokenId,
    };
    setUserData(curr);
  };

  const failureResponseGoogle = (res) => {
   
    setIsLoading(false);
  };

  const onAutoLoadGoogle = (loggedIn) => {
    
    if (!loggedIn) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if (userData && !userData.phone) {
    //   getUser(userData.token);
    // }
    if (userData?.token) {
      
      axios
        .post(`${SERVER_URL}/auth/login`, {
          tokenId: userData.token,
          hostel: HOSTEL,
        })
        .then((response) => {
          
          if (response.status === 200) {
            updateUser(userData);
          }
        })
        .catch((err) => {
          setIsLoading(false);
     
          const errorCode = err.response.status;
          updateUser({ ...userData, errorCode });
        });
    } else {
      
      updateUser(userData);
    }
  }, [userData]);

  return (
    // <div
    //   style={{
    //     height: "100vh",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //   }}
    // >
    //   <GoogleLogin
    //     clientId={CLIENT_ID}
    //     render={(renderProps) => {
    //       return (
    //         <Button
    //           className="shadow"
    //           variant="contained"
    //           onClick={() => {
    //             if (!isLoading) {
    //               setIsLoading(true);
    //               renderProps.onClick();
    //             }
    //           }}
    //           style={{
    //             color: "black",
    //             padding: 10,
    //             margin: 20,
    //             backgroundColor: "white",
    //           }}
    //         >
    //           {!isLoading ? (
    //             <>
    //               <SvgIcon>
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   viewBox="0 0 48 48"
    //                   width="24px"
    //                   height="24px"
    //                 >
    //                   <path
    //                     fill="#FFC107"
    //                     d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    //                   />
    //                   <path
    //                     fill="#FF3D00"
    //                     d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    //                   />
    //                   <path
    //                     fill="#4CAF50"
    //                     d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    //                   />
    //                   <path
    //                     fill="#1976D2"
    //                     d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    //                   />
    //                 </svg>
    //               </SvgIcon>
    //               &nbsp;&nbsp; Login with Google
    //             </>
    //           ) : (
    //             <CircularProgress />
    //           )}
    //         </Button>
    //       );
    //     }}
    //     isSignedIn={true}
    //     onSuccess={successResponseGoogle}
    //     onFailure={failureResponseGoogle}
    //     onAutoLoadFinished={onAutoLoadGoogle}
    //     cookiePolicy={"single_host_origin"}
    //     padding={100}
    //   />
    // </div>
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <GoogleLogin
              clientId={CLIENT_ID}
              render={(renderProps) => {
                return (
                  <Button
                    className="shadow"
                    variant="contained"
                    onClick={() => {
                      if (!isLoading) {
                        setIsLoading(true);
                        renderProps.onClick();
                      }
                    }}
                    style={{
                      backgroundColor: "#0b4178",
                      color: "#FFFFFF",
                      padding: "10px 20px",
                      borderRadius: "24px",
                    }}
                  >
                    {!isLoading ? (
                      <>
                        <SvgIcon>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            width="24px"
                            height="24px"
                          >
                            <path
                              fill="#FFC107"
                              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                            <path
                              fill="#FF3D00"
                              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            />
                            <path
                              fill="#4CAF50"
                              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            />
                            <path
                              fill="#1976D2"
                              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                          </svg>
                        </SvgIcon>
                        &nbsp;&nbsp; Login with Google
                      </>
                    ) : (
                      <CircularProgress style={{ color: "white" }} />
                    )}
                  </Button>
                );
              }}
              isSignedIn={true}
              onSuccess={successResponseGoogle}
              onFailure={failureResponseGoogle}
              onAutoLoadFinished={onAutoLoadGoogle}
              cookiePolicy={"single_host_origin"}
              padding={100}
            />
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3
              style={{
                fontSize: "35px",
                fontWeight: "600",
                marginBottom: "15px ",
              }}
            >
              {HOSTEL}
            </h3>
            <h3 style={{ fontSize: "30px", fontWeight: "600" }}>
              Hostel Elections
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

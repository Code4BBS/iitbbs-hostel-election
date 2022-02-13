import { Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Result from "./Result";
import Login from "./Login";
import Show403 from "./Show403";
import Show404 from "./Show404";
import Show200 from "./Show200";

import { WARDEN_EMAIL } from "./constants";

const passProps = ({ user, updateUser }) => {
  if (user?.email === WARDEN_EMAIL) {
    return [
      {
        path: "/",
        element: <Layout user={user} />,
        children: [
          { path: "results", element: <Result user={user} /> },
          { path: "/", element: <Navigate to="/results" /> },
          { path: "*", element: <Navigate to="/results" /> },
        ],
      },
    ];
  }

  if (user?.errorCode)
    return [
      {
        path: "/",
        element: <Layout user={user} />,
        children: [
          {
            path: "/403",
            element:
              user?.errorCode === 403 ? (
                <Show403 user={user} />
              ) : (
                <Navigate to={`/${user.errorCode}`} />
              ),
          },
          {
            path: "/404",
            element:
              user?.errorCode === 404 ? (
                <Show404 user={user} />
              ) : (
                <Navigate to={`/${user.errorCode}`} />
              ),
          },
          { path: "/", element: <Navigate to={`/${user.errorCode}`} /> },
          { path: "*", element: <Navigate to={`/${user.errorCode}`} /> },
        ],
      },
    ];
  if (user)
    return [
      {
        path: "/",
        element: <Layout user={user} />,
        children: [
          { path: "/election", element: <Home user={user} /> },
          { path: "/403", element: <Show403 user={user} /> },
          { path: "/404", element: <Show404 user={user} /> },
          { path: "/200", element: <Show200 user={user} /> },
          { path: "/", element: <Navigate to="/election" /> },
          { path: "*", element: <Navigate to="/election" /> },
        ],
      },
    ];

  return [
    // {
    //   path: "/login",
    //   element: <Login user={user} updateUser={updateUser} />,
    // },
    { path: "/", element: <Login user={user} updateUser={updateUser} /> },
    { path: "*", element: <Login user={user} updateUser={updateUser} /> },
  ];
};

export default passProps;

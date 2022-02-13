import { Navigate } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import Login from "./Login";
import Show403 from "./Show403";
import Show404 from "./Show404";

const passProps = ({ user, updateUser }) => {
  console.log({ user });
  if (user)
    return [
      { path: "/election", element: <Home user={user} /> },
      { path: "/result", element: <Result user = {user}/>},
      { path: "/403", element: <Show403 user={user} /> },
      { path: "/404", element: <Show404 user={user} /> },
      { path: "/", element: <Navigate to="/election" /> },
      { path: "*", element: <Navigate to="/election" /> },
    ];

  return [
    // {
    //   path: "/login",
    //   element: <Login user={user} updateUser={updateUser} />,
    // },
    { path: "/", element: <Login user={user} updateUser={updateUser} /> },
    { path: "*", element: <Login user={user} updateUser={updateUser} />},
  ];
};

export default passProps;

import { useState } from "react";
import { useRoutes } from "react-router-dom";
import { Container } from "@mui/material";
import "./App.css";
import passProps from "./routes";

function App() {
  const [user, setUser] = useState(null);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const routing = useRoutes(passProps({ user, updateUser }));

  return <div className="App">{routing}</div>;
}

export default App;

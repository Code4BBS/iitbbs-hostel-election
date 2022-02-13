import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import Header from "./Header";

const Layout = ({ user }) => {
  return (
    <div>
      {user && <Header user={user} />}
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;

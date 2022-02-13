import { GoogleLogout } from "react-google-login";
import { Avatar, Button } from "@mui/material";

import { CLIENT_ID } from "../constants";

const LogoutButton = ({ user }) => {
  return (
    <GoogleLogout
      clientId={CLIENT_ID}
      render={(renderProps) => {
        return (
          <Button
            className="shadow"
            variant="contained"
            onClick={() => {
              renderProps.onClick();
            }}
            style={{
              textTransform: "none",
              color: "black",
              backgroundColor: "white",
            }}
            sx={{ width: { xs: "100%" } }}
          >
            <Avatar
              src={user.image}
              sx={{
                width: 30,
                height: 30,
              }}
            />
            &nbsp;&nbsp;Logout
          </Button>
        );
      }}
      onLogoutSuccess={() => {
        window.location.href = "/";
      }}
    />
  );
};

const Header = ({ user }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px 20px",
      }}
    >
      <div>
        <LogoutButton user={user} />
      </div>
    </div>
  );
};

export default Header;

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userStateLogin } from "../pages/Login";
import axios from "axios";

export default function FadeMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [user, setUser] = useRecoilState(userStateLogin);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedToken = localStorage.getItem("token");

    if (storedEmail && storedToken) {
      setUser({
        email: storedEmail,
        token: storedToken,
        name: "",
        password: "",
        likedArticles: [], // initialize likedArticles as an empty array
      });

      // make API call to retrieve the liked crypto array
      axios
        .get(`https://cryptohub-auth-app.herokuapp.com/user/${storedEmail}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          setUser((prevUser) => ({
            ...prevUser,
            likedArticles: response.data.likedCrypto, // update the likedArticles property with the retrieved data
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [setUser]);
  
  const handleLogout = () => {
    setUser(userStateLogin.default);
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    window.location.reload(false);
  };
  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}> <Link className={"link"} to={"/AllCrypto"}>
              All Crypto
            </Link></MenuItem>
        <MenuItem onClick={handleClose}><Link className={"link"} to={"/Exchange"}>
              Exchange rates
            </Link></MenuItem>
        <MenuItem onClick={handleClose}> <Link className={"link"} to={"/Favorite"}>
              Favorite
            </Link></MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
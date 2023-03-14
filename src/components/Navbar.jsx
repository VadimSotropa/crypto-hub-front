import React, { useEffect, useState } from "react";
import logo from "../img/Group 4.svg";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useRecoilState } from "recoil";
import { userStateLogin } from "../pages/Login";
import axios from "axios";
import { FaBars, FaRegWindowClose } from "react-icons/fa";
export default function Navbar() {
  const [user, setUser] = useRecoilState(userStateLogin);
  const [showMenu, setShowMenu] = useState(false);

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
      {user.token ? (
         <div className="NavContainer">
         <Link className={"link-logo"} to={"/"}>
           <img src={logo} alt="" className="image-logo"/>
         </Link>
         <FaBars
   fontSize="35px"
   color="white"
   onClick={() => setShowMenu(!showMenu)}
   className="three-bar-menu"
 />
         <div className="Nav-items">
         
 
           <Link className={"link"} to={"/AllCrypto"}>
             All Crypto
           </Link>
           <Link className={"link"} to={"/Exchange"}>
             Exchange rates
           </Link>
           <Link className={"link"} to={"/Favorite"}>
             Favorite
           </Link>
         </div>
          <div className="registerBtns">
            <button onClick={handleLogout} className="logoutBtn">
              Logout
            </button>
            
          </div>
        </div>
      ) : (
        <div className="NavContainer">
          <Link className={"link-logo"} to={"/"}>
            <img src={logo} alt="" className="image-logo"/>
          </Link>
          <div className="Nav-items">
          <FaBars
    fontSize="35px"
    color="white"
    onClick={() => setShowMenu(!showMenu)}
    className="three-bar-menu"
  />
  
            <Link className={"link"} to={"/AllCrypto"}>
              All Crypto
            </Link>
            <Link className={"link"} to={"/Exchange"}>
              Exchange rates
            </Link>
            <Link className={"link"} to={"/Favorite"}>
              Favorite
            </Link>
          </div>
          <div className="registerBtns">
            <div>
              <Link to={"/Signup"} className="signupBtn">
                Signup
              </Link>
            </div>
            <div>
              <Link className="login" to={"/Login"}>
                Login
              </Link>
            </div>
          </div>
        </div>
        
      )}

{showMenu && (
      <div className="mobileMenu">
        <div className="mobileMenuHeader">
        <Link className={"link-logo"} to={"/"}>
            <img src={logo} alt="" className="image-logo"/>
          </Link>
          <button className="closeMobileMenuBtn" onClick={() => setShowMenu(false)}>
           <FaRegWindowClose/>
          </button>
        </div>
        <div className="mobileMenuItems">
          <Link className={"mobileLink"} to={"/AllCrypto"}>
            All Crypto
          </Link>
          <Link className={"mobileLink"} to={"/Exchange"}>
            Exchange rates
          </Link>
          <Link className={"mobileLink"} to={"/Favorite"}>
            Favorite
          </Link>
          {user.token ? (
            <div className="mobile-login-container">
          <button onClick={handleLogout} className="logoutBtn">
              Logout
            </button>
          </div>
          ) : (<div className="mobile-login-container">
          <div>
            <Link to={"/Signup"} className="mobileSignupBtn">
              Signup
            </Link>
          </div>
          <div>
            <Link className="mobileLogin" to={"/Login"}>
              Login
            </Link>
            </div>
          </div>)}
          
        </div>
      </div>
    )}
    </div>
  );
}

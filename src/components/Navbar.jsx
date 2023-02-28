import React from "react";
import logo from "../img/Group 2.png";
import { Link } from "react-router-dom";
import '../styles/navbar.css'

export default function Navbar() {
  return (
    <div>
      <div className="NavContainer">
        <Link className={"link-logo"} to={"/"}>
          <img src={logo} alt="" />
        </Link>
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
          <div>
          <Link to={"/Signup"} className="signupBtn">Signup</Link>
          </div>
       <div>
       <Link  className="login" to={"/Login"}>Login</Link>
       </div>
         
          
        </div>
      </div>
    </div>
  );
}

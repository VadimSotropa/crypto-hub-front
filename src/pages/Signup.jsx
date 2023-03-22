import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (!e.target.email || !e.target.password || !e.target.name) {
      toast.error('Please fill in all required fields!');
      return;
    }
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://cryptohub-auth-app.herokuapp.com/register",
        user
      );
      console.log(response.data);
      navigate("/Login");
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Email already exists') {
        // Display error toast message
        toast.error('Email already exists!');
      }
    }
  };

  return (
    <div className="main-container-register">
      <Navbar />
      <div className="signupContainer">
        <h2 className="title">Create your accaunt</h2>
        <form onSubmit={handleSubmit} className="formContainer">
          <div>
            <input
              suggested="none"
              className="imputItem"
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
          <div>
            <input
              suggested="none"
              className="imputItem"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
          <div>
            <input
              suggested="none"
              className="imputItem"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <div className="termsText">
            By registering you agree our{" "}
            <span className="termsColor">Terms</span> &{" "}
            <span className="termsColor">Congitions</span>
          </div>
          <button className="submitBTN" type="submit">
            Register
          </button>
        </form>
        <div className="toLogin">
          <span>Already a member?</span>{" "}
          <Link className="loginLink" to={"/Login"}>
            Login
          </Link>
        </div>
        <div className="backContainer">
          <svg
            className="svgBack"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <Link className="backBtn" to={"/"}>
            {" "}
            Return to Home page
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

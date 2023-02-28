import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../components/Navbar'
import { Link } from "react-router-dom";
import '../styles/signup.css'

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
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://cryptohub-auth-app.herokuapp.com/login",
        user
      );
      console.log(response.data);
      navigate("/Favorite");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
   <div>
    <Navbar/>
     <div className="signupContainer">
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit} className="formContainer">
        <div>
        
          <input
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
           className="imputItem"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </div>
        
      <button className="submitBTN" type="submit">Login</button>
      </form>
      <div className="toLogin">
   <span >Don’t have an account?</span> <Link  className="loginLink" to={"/Signup"}>Signup</Link>
    </div>
    <div className="backContainer">    
    <svg className="svgBack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
    <Link className="backBtn" to={"/"}> Return to Home page
    </Link>

</div>
    </div>
   </div>
  );
}

import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../components/Navbar'
import { Link } from "react-router-dom";
import '../styles/signup.css'
import { atom, useRecoilState } from 'recoil';
import toast, { Toaster } from 'react-hot-toast';
import Footer from "../components/Footer"

const userStateLogin = atom({
  key: 'userStateLogin',
  default: {
    email: '',
    password: '',
    name: '',
    token: '',
    likedArticles: '',
  },
});


export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userStateLogin);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (!e.target.email || !e.target.password) {  
      toast.error('Please fill in all required fields!');
      return;
    }
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://cryptohub-auth-app.herokuapp.com/login',
        user
      );

      // Retrieve the user's token from the login response
      const { token } = response.data;

      // Retrieve the user's name and email from the database using their email
      const userData = await axios.get(
        `https://cryptohub-auth-app.herokuapp.com/user/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem('token', token);
    localStorage.setItem('email', user.email);
      // Update the state with the user's data
      setUser({
        ...user,
        name: userData.data.name,
        token,
        likedArticles: userData.data.likedArticles,
        
      });
      
      navigate('/Favorite');
    } catch (error) {
      console.log(error.response.data);
      toast.error('Frong email or password')
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
           suggested="username"
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
          autoComplete="current-password"
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
      <Toaster />
      <div className="toLogin">
   <span >Don’t have an account?</span> <Link  className="loginLink" to={"/Signup"}>Signup</Link>
    </div>
    <div className="backContainer">    
    <svg className="svgBack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
    <Link className="backBtn" to={"/"}> Return to Home page
    </Link>

</div>
    </div>
    <Footer/>
   </div>
  );
}

export { userStateLogin };

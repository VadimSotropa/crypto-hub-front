import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './pages/Home'
import Favorite from './pages/Favorite'
import Exchange from './pages/Exchange'
import AllCrypto from './pages/AllCrypto'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Favorite" element={<Favorite />} />
      <Route path="/Exchange" element={<Exchange />} />
      <Route path="/AllCrypto" element={<AllCrypto />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

import React from "react";
import Navbar from "../components/Navbar";
import CryptoList from "../components/CryptoList";
import Footer from "../components/Footer"
import HeaderHome from "../components/HeaderHome";
import Morebtn from '../components/Morebtn'
function Home() {
  return (
    <div>
      <Navbar />
      <HeaderHome />
      <CryptoList />
      <Morebtn/>
      <Footer/>
    </div>
  );
}

export default Home;

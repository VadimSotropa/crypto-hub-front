import React from "react";
import Navbar from "../components/Navbar";
import CryptoList from "../components/CryptoList";
import Footer from "../components/Footer"
import HeaderHome from "../components/HeaderHome";
function Home() {
  return (
    <div>
      <Navbar />
      <HeaderHome />
      <CryptoList />
      <Footer/>
    </div>
  );
}

export default Home;

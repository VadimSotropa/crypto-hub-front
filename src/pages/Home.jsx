import React from "react";
import Navbar from "../components/Navbar";
import CryptoList from "../components/CryptoList";

import HeaderHome from "../components/HeaderHome";
function Home() {
  return (
    <div>
      <Navbar />
      <HeaderHome />
      <CryptoList />
    </div>
  );
}

export default Home;

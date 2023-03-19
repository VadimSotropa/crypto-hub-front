import React from 'react'
import { Link } from "react-router-dom";
import "../styles/Morebtn.css"
export default function Morebtn() {
  return (
    <div className="cryptolist-morecrypto">
        
        <Link className="cryptolist-morecrypto" to={"/AllCrypto"}>More crypto</Link>

      </div>
  )
}

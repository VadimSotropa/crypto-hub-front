import React from 'react'
import { Link } from "react-router-dom";
import '../styles/LoginFavorite.css'

export default function LoginFavorit() {
  return (
    <div className='LoginFavorite-container'>
        <h1 className='LoginFavorite-title'>
            Login to add the cryptocurrency to favorite
        </h1>
<Link to={"/Login"} className='LoginFavorite-btn'>Login</Link>
    </div>
  )
}

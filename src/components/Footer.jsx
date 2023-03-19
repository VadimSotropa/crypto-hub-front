import React from "react";
import '../styles/footer.css'
const Footer = () => {
  return (
    <footer className="footer-container">

     
          <div className="footer-left-container">
            <p className="">&copy; {new Date().getFullYear()} Vadim Sotropa. All rights reserved.</p>
          </div>
          <div className="footer-right-container">
            <p className="">Developed and designed by Vadim Sotropa</p>
            <p className="">
              Interested in hiring me? <a href="https://www.linkedin.com/in/vadim-sotropa/" target="_blank" className="footer-link" rel="noreferrer">Let's chat</a>.
            </p>
          </div>
      
  
    </footer>
  );
};

export default Footer;
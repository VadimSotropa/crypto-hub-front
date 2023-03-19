import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Vadim Sotropa. All rights reserved.</p>
          </div>
          <div>
            <p className="text-sm">Developed and designed by Vadim Sotropa</p>
            <p className="text-sm">
              Interested in hiring me? <a href="[link to your portfolio or job search profile]" className="text-white underline">Let's chat</a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
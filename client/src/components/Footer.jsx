import React from "react";


function Footer() {
  return (
    <footer className="bg-black text-white w-full py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-lg font-semibold italic">
          LostNFound © {new Date().getFullYear()}
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/about" className="hover:text-gray-400">About</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
          <a href="/privacy" className="hover:text-gray-400">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

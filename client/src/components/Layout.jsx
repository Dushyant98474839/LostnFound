// src/components/Layout.js
import React from "react";
import Footer from "./Footer"; 
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar/> */}

      {/* Page content */}
      <main className="flex-grow">{children}</main>


      <Footer />
    </div>
  );
}

export default Layout;

// src/components/Layout.js
import React from "react";
import Footer from "./Footer"; 

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      

      {/* Page content */}
      <main className="flex-grow">{children}</main>


      <Footer />
    </div>
  );
}

export default Layout;

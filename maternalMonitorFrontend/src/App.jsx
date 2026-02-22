import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
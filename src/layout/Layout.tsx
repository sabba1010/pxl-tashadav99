import React from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

const Layout = () => {
  const navigation = useNavigation();
  const isNavigation = navigation.state === "loading";
  return (
    <div className="min-h-screen flex flex-col">
      {isNavigation ? (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <Loading />
        </div>
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;

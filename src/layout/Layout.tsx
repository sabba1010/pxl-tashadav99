import React from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

const Layout = () => {
  const navigation = useNavigation();
  const isNavigation = navigation.state === "loading";
  return (
    <div>
      {isNavigation ? (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <Loading />
        </div>
      ) : (
        <>
          <Navbar />
          <div className="min-h-[calc(100vh-220px)]">
            <Outlet />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;

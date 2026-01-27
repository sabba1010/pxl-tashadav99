import React from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import NotificationListener from "../components/NotificationListener";
import { useAuthHook } from "../hook/useAuthHook";

const Layout = () => {
  const navigation = useNavigation();
  const isNavigation = navigation.state === "loading";
  const { data: user } = useAuthHook();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Notification Alert System with Sound */}
      {user && user.email && <NotificationListener userEmail={user.email} pollInterval={3000} />}
      
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

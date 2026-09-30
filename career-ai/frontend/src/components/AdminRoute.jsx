import React from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const AdminRoute = () => {

  const {
    user,
    loading,
  } = useAuth();


  // ==========================================
  // CHECKING LOGIN
  // ==========================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-950
          text-white
          flex
          items-center
          justify-center
        "
      >

        Checking admin access...

      </div>

    );

  }


  // ==========================================
  // USER NOT LOGGED IN
  // ==========================================

  if (!user) {

    return (

      <Navigate
        to="/login"
        replace
      />

    );

  }


  // ==========================================
  // USER IS NOT ADMIN
  // ==========================================

  if (user.role !== "admin") {

    return (

      <Navigate
        to="/"
        replace
      />

    );

  }


  // ==========================================
  // ADMIN
  // ==========================================

  return <Outlet />;

};


export default AdminRoute;
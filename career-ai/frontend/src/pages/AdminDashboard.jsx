import React from "react";
import { useAuth } from "../context/AuthContext";


const AdminDashboard = () => {

  const {
    user,
    logout,
  } = useAuth();


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="border-b border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold">
              Career AI Admin
            </h1>

            <p className="text-slate-400">
              Administration Dashboard
            </p>

          </div>


          <button
            onClick={logout}
            className="px-5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
          >
            Logout
          </button>

        </div>

      </div>


      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            Welcome, {user?.name}
          </h2>

          <p className="text-slate-400 mt-2">
            {user?.email}
          </p>

        </div>


        <div className="grid md:grid-cols-4 gap-5">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Total Users
            </p>

            <h3 className="text-3xl font-bold mt-3">
              --
            </h3>
          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Verified Users
            </p>

            <h3 className="text-3xl font-bold mt-3">
              --
            </h3>
          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Job Applications
            </p>

            <h3 className="text-3xl font-bold mt-3">
              --
            </h3>
          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              AI Interviews
            </p>

            <h3 className="text-3xl font-bold mt-3">
              --
            </h3>
          </div>

        </div>


        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h3 className="text-xl font-semibold">
            Admin Controls
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mt-5">

            <button className="p-5 text-left rounded-xl bg-slate-800 hover:bg-slate-700">
              👥 Manage Users
            </button>

            <button className="p-5 text-left rounded-xl bg-slate-800 hover:bg-slate-700">
              💼 Manage Jobs
            </button>

            <button className="p-5 text-left rounded-xl bg-slate-800 hover:bg-slate-700">
              📊 View Analytics
            </button>

          </div>

        </div>

      </main>

    </div>
  );
};


export default AdminDashboard;
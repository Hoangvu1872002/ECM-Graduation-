import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { AdminSidebar } from "../../components";

const AdminLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  if (!isLoggedIn || !current || current.role !== "admin")
    return <Navigate to={`/${path.LOGIN}`} replace={true}></Navigate>;
  return (
    <div className="flex w-full bg-gray-100 min-h-screen relative text-gray-900">
      <div className="w-[18%] flex-none top-0 bottom-0 fixed">
        <AdminSidebar></AdminSidebar>
      </div>
      <div className="w-[18%] flex-none top-0 bottom-0"></div>
      <div className="flex-auto">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default AdminLayout;

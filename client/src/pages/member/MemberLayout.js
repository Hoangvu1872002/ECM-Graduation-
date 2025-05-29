import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { MemberSidebar } from "../../components";

const MemberLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  if (!isLoggedIn || !current)
    return <Navigate to={`/${path.LOGIN}`} replace={true}></Navigate>;
  return (
    <div className="flex w-full bg-gray-100 min-h-screen relative text-gray-900">
      <div className="w-[18%] flex-none top-0 bottom-0 fixed">
        <MemberSidebar></MemberSidebar>
      </div>
      <div className="w-[18%] flex-none top-0 bottom-0"></div>
      <div className="flex-auto">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default MemberLayout;

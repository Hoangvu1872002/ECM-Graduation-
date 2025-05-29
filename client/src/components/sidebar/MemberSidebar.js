import React, { Fragment, memo, useState } from "react";
import avatar from "../../assets/avatarDefault.png";
import { memberSidebar } from "../../ultils/contants";
import { NavLink, Link } from "react-router-dom";
import clsx from "clsx";
import icons from "../../ultils/icons";
import { useSelector } from "react-redux";
import Button from "../buttons/Button";

const activedStyle = "px-4 py-2 flex items-center gap-2 bg-blue-400";
const notActivedStyle = "px-4 py-2 flex items-center gap-2  hover:bg-blue-100";

const MemberSidebar = () => {
  const { FaBackward } = icons;
  const { current } = useSelector((state) => state.user);

  return (
    <div className=" bg-white h-full py-4 flex flex-col justify-between">
      <div>
        <div className="flex flex-col justify-center items-center pb-2 mt-2 gap-2 border-b">
          <img
            src={current?.avatar || avatar}
            alt="logo"
            className="rounded-full w-16 h-16 object-contain border"
          ></img>
          <small className="font-semibold">{`${current?.lastname} ${current?.firstname}`}</small>
        </div>
        <div className="pt-2">
          {memberSidebar.map((e) => (
            <Fragment key={e.id}>
              {e.type === "SINGLE" && (
                <NavLink
                  to={e.path}
                  className={({ isActive }) =>
                    clsx(isActive && activedStyle, !isActive && notActivedStyle)
                  }
                >
                  <span>{e.icon}</span>
                  <span>{e.text}</span>
                </NavLink>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <NavLink to={"/"} className="pl-4">
        <Button>
        <div className="flex justify-center items-center gap-2">
          <FaBackward></FaBackward>
          <span>Back</span>
        </div>
        </Button>
      </NavLink>
    </div>
  );
};

export default memo(MemberSidebar);

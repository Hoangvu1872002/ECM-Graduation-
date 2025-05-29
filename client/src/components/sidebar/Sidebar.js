import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { createSlug } from "../../ultils/helper";
import { useSelector } from "react-redux";
import { iconSidebar } from "../../ultils/contants";
import icons from "../../ultils/icons";
const Sidebar = () => {
  const { categories } = useSelector((state) => state.app);
  const { TfiMenuAlt } = icons;

  return (
    <div className="shadow-md rounded-lg">
      <div className="bg-main flex items-center text-white font-semibold px-5 py-[10px] text-base rounded-t-lg border border-red-500">
        <span className="mr-[10px]">
          <TfiMenuAlt size={16}></TfiMenuAlt>
        </span>
        <span>ALL COLLECTIONS</span>
      </div>
      <div className="flex flex-col border-x border-b p-1">
        {categories?.map((e, index) => (
          <NavLink
            key={createSlug(e.title)}
            to={createSlug(e.title)}
            className={({ isActive }) =>
              isActive
                ? "bg-main text-white px-5 pt-[15px] pb-[14px] text-sm"
                : " px-5 pt-[15px] border-t pb-[14px] pl-[-2px] mx-4 text-sm hover:text-main hover:pl-10 hover:bg-gray-100 hover:border-l-2 hover:font-semibold hover:border-l-red-600"
            }
          >
          <div className="flex items-center justify-start gap-4">
            <span>{iconSidebar[index].icon}</span>
            <span>{e.title}</span>
          </div>
            {/* {e.title} */}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default memo(Sidebar);

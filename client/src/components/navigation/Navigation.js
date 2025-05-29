import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { navigation } from "../../ultils/contants";

const Navigation = () => {
  return (
    <div className="w-main min-h-[48px] py-2 border-y text-sm flex items-center">
      {navigation.map((e) => (
        <NavLink
          to={e.path}
          key={e.id}
          className={({ isActive }) =>
            isActive
              ? "pr-12 text-main"
              : "pr-12 hover:text-main hover:border-l-red-600"
          }
        >
          {e.value}
        </NavLink>
      ))}
    </div>
  );
};

export default memo(Navigation);

import React, { memo } from "react";

const ProductExtrainfo = ({ icon, title, sub }) => {
  return (
    <div className="flex items-center p-3 gap-4 mb-[7px] border shadow-md rounded-lg">
      <span className="p-2 text-white bg-gray-800 rounded-full flex items-center justify-center">
        {icon}
      </span>
      <div className="flex flex-col text-sm text-gray-500">
        <span className="font-medium">{title}</span>
        <span className="text-xs">{sub}</span>
      </div>
    </div>
  );
};

export default memo(ProductExtrainfo);

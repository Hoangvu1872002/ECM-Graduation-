import React, { memo } from "react";

const Countdown = ({ unit, number }) => {
  return (
    <div className="w-[30%] rounded-md bg-[#F4F4F4] h-[60px] border flex items-center justify-center flex-col">
      <span className="text-[18px] text-gray-800 font-medium">{number}</span>
      <span className="text-xs text-gray-700">{unit}</span>
    </div>
  );
};

export default memo(Countdown);

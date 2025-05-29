import React, { memo, useEffect, useRef } from "react";
import icons from "../../ultils/icons";

const Votebar = ({ number, ratingCount, ratingTotal }) => {
  const percenRef = useRef();

  const { BiSolidStar } = icons;

  useEffect(() => {
    const percent = Math.round((ratingCount * 100) / ratingTotal) || 0;
    percenRef.current.style.cssText = `right: ${100 - percent}%`;
  }, [ratingCount, ratingTotal]);

  return (
    <div className=" flex items-center gap-2 text-sm text-gray-500">
      <div className="flex w-[10%] items-center justify-center gap-1 text-sm">
        <span>{number}</span>
        <BiSolidStar color="orange"></BiSolidStar>
      </div>
      <div className="w-[75%]">
        <div className="w-full h-[8px] relative bg-gray-200 rounded-l-full rounded-r-full">
          <div ref={percenRef} className="absolute inset-0 rounded-l-full rounded-r-full bg-red-500"></div>
        </div>
      </div>
      <div className="w-[15%] flex justify-end text-xs text-400">
        {`${ratingCount || 0} reviewers`}
      </div>
    </div>
  );
};

export default memo(Votebar);

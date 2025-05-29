import React, { memo } from "react";
import { HashLoader } from "react-spinners";
const Loading = () => {
  return (
    <div className="h-full">
      <HashLoader color="#ee3131"></HashLoader>
    </div>
  );
};

export default memo(Loading);

import React, { memo } from "react";

const Button = ({ children, handleOnClick, style, fw, type ='button' }) => {
  return (
    <button
      type={type}
      className={
        style
          ? style
          : `px-4 py-2 my-2 rounded-md shadow-md text-white bg-main hover:bg-red-600 text-semibold ${
              fw ? "w-full" : "w-fit"
            }`
      }
      onClick={() => {
        handleOnClick && handleOnClick();
      }}
    >
      {children}
    </button>
  );
};

export default memo(Button);

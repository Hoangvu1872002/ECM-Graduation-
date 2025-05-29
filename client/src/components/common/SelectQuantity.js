import React, { memo } from "react";

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
  return (
    <div className="flex items-center ">
      <span onClick={ () => handleChangeQuantity("minus")} className=" bg-slate-100 cursor-pointer p-1 border-r border-black">-</span>
      <input
        type="text"
        className="py-1 outline-none w-[50px] text-center bg-slate-100"
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value)}
      ></input>
      <span onClick={() => handleChangeQuantity("plus")} className="bg-slate-100 cursor-pointer p-1 border-l border-black">+</span>
    </div>
  );
};

export default memo(SelectQuantity);

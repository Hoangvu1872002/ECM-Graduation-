import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Product } from "../../components";
import { ToastContainer } from "react-toastify";

const Wishlist = () => {
  const { current } = useSelector((state) => state.user);
  return (
    <div className="relative w-full flex flex-col">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Wishlist</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="grid grid-cols-5 gap-4 w-full mt-5 px-5 flex-wrap">
        {current?.wishlist?.map((e, index) => (
          <div key={index} className="bg-white py-2 border rounded-md">
            <Product pid={e._id} productData={e} normal></Product>
          </div>
        ))}
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default memo(Wishlist);

import React, { memo } from "react";
import icons from "../../ultils/icons";

const { MdEmail } = icons;
const Footer = () => {
  return (
    <div className="w-full ">
      <div className="flex items-center w-full h-[80px] bg-main justify-center">
        <div className="w-main flex items-center justify-between">
          <div className="flex flex-col flex-1">
            <span className="text-[20px] text-gray-100">
              SIGN UP TO NEWSLETTER
            </span>
            <small className="text-[13px] text-gray-300">
              Subscribe now and receive weekly newsletter
            </small>
          </div>
          <div className="flex-1 flex items-center">
            <input
              className="p-4 pr-0 rounded-l-full w-full bg-[#F04646] ouyline-none text-gray-100 placeholder:text-sm placeholder:text-gray-200 placeholder:italic placeholder:opacity-50"
              type="text"
              placeholder="Email address"
            ></input>
            <div className="h-[56px] w-[56px] bg-[#F04646] rounded-r-full flex items-center justify-center text-white">
              <MdEmail size={18}></MdEmail>
            </div>
          </div>
        </div>
      </div>
      <div className=" h-[300px] w-full bg-zinc-900 flex items-center justify-center text-white text-[13px]">
        <div className="w-main flex">
          <div className="flex-2 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px]">
              ABOUT US
            </h3>
            <span>
              <span>Address:</span>
              <span className="opacity-70">
                {" "}
                474 Ontario St Toronto, ON M4X 1M7 Canada
              </span>
            </span>
            <span>
              <span>Phone:</span>
              <span className="opacity-70"> (+1234)56789xxx</span>
            </span>
            <span>
              <span>Mail:</span>
              <span className="opacity-70"> hoangvu1872k2@gmail.com</span>
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px]">
              INFORMATION
            </h3>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Typography
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Gallery
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Store Location
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Today's Deals
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Contact
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px]">
              WHO WE ARE
            </h3>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Help
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Free Shipping
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              FAQs
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Return & Exchange
            </span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">
              Testimonials
            </span>
          </div>
          <div className="flex-1">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-4 border-main pl-[15px]">
              #DIGITALWORLDSTORE
            </h3>
          </div>
        </div>
      </div>
      <div className="h-[50px] w-full bg-black"></div>
    </div>
  );
};

export default memo(Footer);

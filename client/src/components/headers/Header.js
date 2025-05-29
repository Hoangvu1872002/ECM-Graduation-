import React, { Fragment, memo } from "react";
import logo from "../../assets/logo.png";
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from "react-redux";
import withBase from "../../hocs/withBase";
import { showCart } from "../../store/app/appSlice";

const Header = ({ dispatch }) => {
  const {
    FaPhoneAlt,
    MdEmail,
    IoBagRemove,
    FaUserCircle,
    IoHomeSharp,
    IoSettings,
  } = icons;
  const { current } = useSelector((state) => state.user);
  return (
    <div className=" w-main flex justify-between h-[110px] py-[35px]">
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className="w-[234px] object-contain"></img>
      </Link>
      <div className="flex text-[13px]">
        <div className="flex flex-col px-6 border-r items-center">
          <span className="flex gap-3 items-center">
            <FaPhoneAlt color="red"></FaPhoneAlt>
            <span className="font-semibold">(+1800) 000 8808</span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className="flex flex-col px-6 border-r items-center">
          <span className="flex gap-3 items-center">
            <MdEmail color="red"></MdEmail>
            <span className="font-semibold">SUPPORT@TADATHEMES.COM</span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        {current && (
          <Fragment>
            <div
              onClick={() => dispatch(showCart())}
              className="py-2 flex hover:text-red-500 cursor-pointer items-center px-6 border-r justify-center"
            >
              <div className="hover:bg-gray-100 flex items-center justify-center gap-2 px-3 py-2 rounded-lg">
                <IoBagRemove size={24}></IoBagRemove>
                <span className="">
                  {`${current?.cart?.length || 0}`} items
                </span>
              </div>
            </div>
            <Link
              className=" hover:text-red-500 cursor-pointer px-6"
              to={`/${path.MEMBER}/${path.PERSONAL}`}
            >
              <div className="hover:bg-gray-100 flex items-center justify-center gap-2 px-3 py-2 rounded-lg">
                <FaUserCircle size={24}></FaUserCircle>
                <span className=""> Profile </span>
              </div>
            </Link>
            {current?.role === "admin" && (
              <Link
                className=" hover:text-red-500 cursor-pointer border-l px-3"
                to={`/${path.ADMIN}/${path.DASHBOARD}`}
              >
                <div className="hover:bg-gray-100 flex items-center justify-center gap-2 px-3 py-2 rounded-lg">
                  <IoSettings size={24}></IoSettings>
                  <span className=""> Manage </span>
                </div>
              </Link>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default withBase(memo(Header));

import React, { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../../store/users/asyncAction";
import icons from "../../ultils/icons";
import { logout, clearMessage } from "../../store/users/userSlide";
import Swal from "sweetalert2";

const TopHeader = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, current, mes } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { IoLogOutOutline } = icons;
  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 300);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (mes)
      Swal.fire("Oops!", mes, "info").then(() => {
        dispatch(clearMessage());
        navigate(`/${path.LOGIN}`);
      });
  }, [mes]);
  return (
    <div className="min-h-[40px] w-full bg-main flex items-center justify-center p-2">
      <div className="w-main flex items-center justify-between text-xs text-white">
        <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
        {isLoggedIn && current ? (
          <div className="flex text-sm items-center justify-center gap-2">
            <span className=" font-semibold">{`Wellcome ${current?.lastname} ${current?.firstname} !`}</span>
            <Link
              onClick={() => dispatch(logout())}
              to={`/${path.LOGIN}`}
              className="font-semibold hover:rounded-full cursor-pointer hover:bg-gray-200 hover:text-main p-2"
            >
              <IoLogOutOutline size={18}></IoLogOutOutline>
            </Link>
          </div>
        ) : (
          <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>
            Sign In or Create Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);

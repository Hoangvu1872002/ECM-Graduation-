import React, { memo, useCallback, useEffect, useState } from "react";
import SelectQuantity from "../common/SelectQuantity";
import { formatMoney, getColorClass } from "../../ultils/helper";
import { apiRemoveCart, apiUpdateCart } from "../../apis";
import icons from "../../ultils/icons";
import withBase from "../../hocs/withBase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCurrent } from "../../store/users/asyncAction";
import Swal from "sweetalert2";

const OrderItem = ({ e, dispatch, defaultQuantity = 1, index }) => {
  const { MdDeleteForever } = icons;
  // console.log(getColorClass(e.color));

  const [quantity, setQuantity] = useState(() => defaultQuantity);
  const [resetQuantity, setResetQuantity] = useState(() => 1);

  const handleQuantity = useCallback(
    (number) => {
      // console.log("abc");
      setResetQuantity(quantity);
      if (!Number(number) || Number(number) < 1) {
        return;
      } else setQuantity(number);
    },
    [quantity]
  );

  const handleChangeQuantity = (flag) => {
    // console.log(quantity);
    setResetQuantity(quantity);
    if (flag === "minus" && quantity === 1) return;
    if (flag === "minus") setQuantity((prev) => +prev - 1);
    if (flag === "plus") setQuantity((prev) => +prev + 1);
  };

  const getCount = async (
    pid,
    quantity,
    color,
    price,
    title,
    thumbnail,
    discount
  ) => {
    const response = await apiUpdateCart({
      pid,
      quantity,
      color,
      price,
      thumbnail,
      title,
      discount,
    });
    if (response.success) {
      dispatch(getCurrent());
    } else {
      // if (response.notEnough) {
      //   Swal.fire("Oops!", response.mes, "error").then(() => {
      //     console.log(resetQuantity);
      //     setQuantity(resetQuantity);
      //   });
      // } else {
      //   toast.error(response.mes);
      // }
      if (response.notEnough && response.checkQuantityClear0) {
        toast.error(response.mes);
        dispatch(getCurrent());
      } else if (response.notEnough && !response.checkQuantityClear0) {
        toast.error(response.mes);
        setQuantity(resetQuantity);
      } else {
        toast.error(response.mes);
      }
    }
  };

  const removeCart = async (pid, color) => {
    const response = await apiRemoveCart(pid, color);
    if (response.success) {
      dispatch(getCurrent());
    } else {
      toast.error(response.mes);
    }
  };

  useEffect(() => {
    getCount(
      e.product._id,
      quantity,
      e.color,
      e.price,
      e.title,
      e.thumbnail,
      e.discount
    );
  }, [quantity]);

  return (
    <div className="border flex w-full mt-1 py-3 mx-auto">
      <span className="px-4 text-sm flex-1 w-full text-center flex items-center justify-center">
        {index}
      </span>
      <span className="px-4 flex-8 w-full text-center flex justify-start items-center">
        <div className="flex gap-2 pl-6 items-center ">
          <img
            src={e?.thumbnail}
            alt="thumb"
            className="w-14 h-14 object-cover"
          ></img>
          <div className="flex flex-col items-start gap-1 ml-2">
            <span className="text-sm flex text-start">{e?.title}</span>
            <span
              className={`w-3 h-3 ${getColorClass(e?.color)} border rounded-lg`}
            ></span>
          </div>
        </div>
      </span>
      <span className="px-4 flex-6 w-full  text-sm text-main text-center flex justify-center items-center">
        {formatMoney(e?.price) + " vnd"}
      </span>

      <span className="px-4  flex-6 w-full text-center text-gray-500 line-through text-sm flex justify-center items-center">
        {formatMoney(Math.ceil((e?.price / (100 - e?.discount)) * 100))} vnd
      </span>

      <span className="px-4 flex-4 w-full text-center flex justify-center items-center">
        <div className="border">
          <SelectQuantity
            quantity={quantity}
            handleQuantity={handleQuantity}
            handleChangeQuantity={handleChangeQuantity}
          ></SelectQuantity>
        </div>
      </span>
      <span className="px-4 flex-6 font-semibold w-full text-sm text-center flex justify-center items-center text-main">
        {formatMoney(e?.price * quantity) + " vnd"}
      </span>
      <span className="px-4 flex-4 w-full text-center flex justify-center items-center">
        <span
          onClick={() => {
            removeCart(e?.product?._id, e?.color);
          }}
          className="mr-2 mt-[-10px]  flex items-center justify-center hover:text-red-600  cursor-pointer"
        >
          <span className="h-8 w-8 rounded-full flex justify-center items-center">
            <MdDeleteForever size={26}></MdDeleteForever>
          </span>
        </span>
      </span>
    </div>
  );
};

export default withBase(memo(OrderItem));

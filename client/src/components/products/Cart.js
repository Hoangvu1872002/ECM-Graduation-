import React, { memo } from "react";
import icons from "../../ultils/icons";
import withBase from "../../hocs/withBase";
import { showCart } from "../../store/app/appSlice";
import { useSelector } from "react-redux";
import { formatMoney } from "../../ultils/helper";
import Button from "../buttons/Button";
import { apiRemoveCart } from "../../apis";
import { getCurrent } from "../../store/users/asyncAction";
import { ToastContainer, toast } from "react-toastify";
import path from "../../ultils/path";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Cart = ({ dispatch }) => {
  const { BsBackspaceReverseFill, MdDeleteForever } = icons;

  const navigate = useNavigate();

  const { current, currentCart } = useSelector((state) => state.user);

  const removeCart = async (pid, color) => {
    const response = await apiRemoveCart(pid, color);
    if (response.success) {
      dispatch(getCurrent());
    } else {
      toast.error(response.mes);
    }
  };

  const handleCheckout = () => {
    if (currentCart.length === 0) {
      Swal.fire({
        text: "Please add products to cart before payment.",
        cancelButtonText: "Cancel",
        confirmButtonText: "Go product page",
        title: "Oops!",
        showCancelButton: true,
      }).then((rs) => {
        if (rs.isConfirmed) navigate(`/${path.PRODUCTS}`);
      });
    } else {
      dispatch(showCart());
      navigate(`/${path.DETAIL_CHECKOUT}`);
    }
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[27%] grid grid-rows-10 h-screen bg-black text-white p-6"
    >
      <header className="border-b row-span-1 h-full border-gray-600 font-bold text-2xl flex justify-between items-center">
        <span>Your Cart</span>
        <span
          onClick={() => dispatch(showCart())}
          className="cursor-pointer p-2 hover:text-red-600"
        >
          <BsBackspaceReverseFill size={24}></BsBackspaceReverseFill>
        </span>
      </header>
      <section className="row-span-7 my-2 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3">
        {!current?.cart && (
          <span className="text-xs italic"> Your cart is empty.</span>
        )}
        {current?.cart &&
          current?.cart.map((e) => (
            <div
              key={e._id}
              className="flex justify-between border-b border-gray-600"
            >
              <div className="flex gap-2 pb-3  items-center ">
                <img
                  src={e?.thumbnail}
                  alt="thumb"
                  className="w-16 h-16 object-cover rounded-lg"
                ></img>
                <div className="flex flex-col">
                  <span className="text-main text-sm">{e.title}</span>
                  <span className=" flex gap-2 justify-start items-center">
                    <span className="text-[10px]">{e?.color}</span>
                    <span>|</span>
                    <span className="text-[10px]">
                      QUANTITY ({e?.quantity})
                    </span>
                  </span>
                  <span className="text-sm">
                    {formatMoney(e?.price * e?.quantity) + " vnd"}
                  </span>
                </div>
              </div>
              <span
                onClick={() => removeCart(e?.product?._id, e?.color)}
                className="mr-2 mt-[-10px]  flex items-center justify-center hover:text-red-600  cursor-pointer"
              >
                <span className="h-8 w-8 rounded-full flex justify-center items-center hover:bg-gray-700">
                  <MdDeleteForever size={22}></MdDeleteForever>
                </span>
              </span>
            </div>
          ))}
        {currentCart.length === 0 && (
          <div className=" text-main text-base text-center h-full flex justify-center items-center">
            Your shopping cart does not contain any products.
          </div>
        )}
      </section>
      <div className="row-span-2 flex flex-col justify-between h-full">
        <div className="flex items-center mt-4 justify-between pt-4 border-t m">
          <span>
            Total payment (
            {`${currentCart?.reduce((sum, el) => +el?.quantity + sum, 0)} pcs`}
            ):
          </span>
          <span className="">
            {/* {current?.cart.length + " pcs"} */}
            {`${formatMoney(
              currentCart?.reduce(
                (sum, el) => +el?.price * el?.quantity + sum,
                0
              )
            )} vnd`}
          </span>
        </div>
        <span className="text-center text-gray-400 italic text-xs">
          Shipping, taxes, and discounts calculated at checkout.
        </span>
        <div className="flex gap-4">
          <Button
            handleOnClick={handleCheckout}
            style="rounded-md w-full bg-main py-2 hover:bg-red-600"
          >
            Checkout
          </Button>
          <Button
            handleOnClick={() => {
              dispatch(showCart());
              navigate(`/${path.DETAIL_CART}`);
            }}
            style="rounded-md w-full bg-main py-2 hover:bg-red-600"
          >
            Shopping Cart
          </Button>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default withBase(memo(Cart));

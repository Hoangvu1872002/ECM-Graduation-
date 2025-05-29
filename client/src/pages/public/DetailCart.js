import React, { memo, useEffect, useRef } from "react";
import { Breadcrumbs, Button } from "../../components";
import withBase from "../../hocs/withBase";
import { useSelector } from "react-redux";
import { formatMoney } from "../../ultils/helper";
import { ToastContainer } from "react-toastify";
import OrderItem from "../../components/products/OrderItem";
import { NavLink } from "react-router-dom";
import path from "../../ultils/path";
import Swal from "sweetalert2";
// import { updateCart } from "../../store/users/userSlide";
// import { apiUpdateCart } from "../../apis";
// import { getCurrent } from "../../store/users/asyncAction";
// import { toast } from "react-toastify";

const DetailCart = ({ navigate }) => {
  const { currentCart } = useSelector((state) => state.user);
  // console.log(currentCart);
  const titleRef = useRef();

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
    } else navigate(`/${path.DETAIL_CHECKOUT}`);
  };

  useEffect(() => {
    titleRef.current.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div className="w-full">
      <div className="h-[81px] mt-4 flex justify-center items-center bg-gray-50">
        <div ref={titleRef} className="w-main">
          <span className="font-semibold text-[18px]">My Cart</span>
          <div className="mt-2">
            <Breadcrumbs></Breadcrumbs>
          </div>
        </div>
      </div>
      <div className="w-main mx-auto mt-4 my-8">
        <div className="py-4 border mx-auto bg-gray-200 w-main">
          <div className="font-semibold flex">
            <span className="px-4 flex-1 w-full text-center">#</span>
            <span className="px-4 flex-8 w-full text-center">Products</span>
            <span className="px-4 flex-6 w-full text-center">Unit price</span>
            <span className="px-4 flex-6 w-full text-center">
              Original price
            </span>
            <span className="px-4 flex-4 w-full text-center"> Quantity</span>
            <span className="px-4 flex-6 w-full text-center">
              Amount of money
            </span>
            <span className="px-4 flex-4 w-full text-center">Action</span>
          </div>
        </div>

        {currentCart?.map((e, index) => (
          <div key={index}>
            <OrderItem
              e={e}
              defaultQuantity={e.quantity}
              index={index}
            ></OrderItem>
          </div>
        ))}
        <div className="w-main mx-auto flex flex-col gap-3 items-end justify-center mt-4">
          <span className="flex gap-4">
            <span>
              Total payment (
              {currentCart?.reduce((sum, el) => +el?.quantity + sum, 0)}{" "}
              products):
            </span>
            <span className="text-main  font-semibold">
              {`${formatMoney(
                currentCart?.reduce(
                  (sum, el) => +el?.price * el?.quantity + sum,
                  0
                )
              )} vnd`}
            </span>
          </span>
          <span className="text-xs italic">
            Shipping, taxes, and discounts calculated at checkout.
          </span>

          <Button handleOnClick={handleCheckout}>Checkout</Button>
        </div>
      </div>

      {/* <div className="h-[50px] w-full"></div> */}
      <ToastContainer autoClose={3200} />
    </div>
  );
};

export default withBase(memo(DetailCart));

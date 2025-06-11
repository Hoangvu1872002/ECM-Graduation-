import React, { memo, useEffect, useRef, useState } from "react";
import withBase from "../../hocs/withBase";
import { Breadcrumbs, Button } from "../../components";
import icons from "../../ultils/icons";
import { useSelector } from "react-redux";
import path from "../../ultils/path";
import { formatMoney, getColorClass } from "../../ultils/helper";
import { apiCreateOrder, apiVnpay } from "../../apis";
import Swal from "sweetalert2";
import Congrat from "../../components/common/Congrat";
import { getCurrent } from "../../store/users/asyncAction";
import { addressStore } from "../../ultils/contants";

const DetailCheckout = ({ navigate, dispatch }) => {
  const { IoLocation, TbExchange } = icons;
  const titleRef = useRef();

  const { currentCart, current } = useSelector((state) => state.user);

  const [paymentMethods, setPaymentMethods] = useState();

  const [textareaValue, setTextareaValue] = useState();

  const [isSuccess, setIsSuccess] = useState(false);

  let timer;

  const handleTextareaChange = (event) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setTextareaValue(event.target.value);
    }, 500);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Khoảng cách (km)
  };

  const findNearestAddress = (userLat, userLon) => {
    let nearestAddress = null;
    let minDistance = Infinity;

    addressStore.forEach((store) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        store.latitude,
        store.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestAddress = store;
      }
    });

    return nearestAddress;
  };

  const userLat = current?.address?.latitude;
  const userLon = current?.address?.longitude;

  const nearestAddress = findNearestAddress(userLat, userLon);

  const totalPayment =
    currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) +
    (currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) * 5) /
      100 -
    (+currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) *
      2) /
      100 +
    30000;

  const totalPrice = currentCart?.reduce(
    (sum, el) => +el?.price * el?.quantity + sum,
    0
  );

  const coupons =
    (+currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) *
      2) /
    100;

  const tax =
    (currentCart?.reduce((sum, el) => +el?.price * el?.quantity + sum, 0) * 5) /
    100;

  const data = {
    products: currentCart,
    totalPriceProducts: totalPrice,
    transportFee: 30000,
    tax: tax,
    coupons: coupons,
    total: totalPayment,
    message: textareaValue,
    // address: current?.address,
    shippingAddress: {
      main_name_place: nearestAddress?.main_name_place,
      description: nearestAddress?.description,
      latitude: nearestAddress.latitude,
      longitude: nearestAddress.longitude,
    }, // Địa chỉ giao hàng gần nhất
    billingAddress: current?.address, // Địa chỉ nhận hàng của người dùng
    paymentMethods: paymentMethods,
  };

  const handleSaveOrder = async () => {
    const response = await apiCreateOrder(data);
    if (response.success) {
      setIsSuccess(true);
      setTimeout(async () => {
        Swal.fire("Congrat!", "Order was created!", "success").then(() => {
          dispatch(getCurrent());
        });
      }, [500]);
    } else {
      Swal.fire("Oops!", response.mes, "info").then(() => {
        navigate(`/${path.HOME}`);
        dispatch(getCurrent());
      });
    }
  };

  const handleVnpay = async () => {
    localStorage.setItem(
      "dataCheckout",
      JSON.stringify({ dataCheckout: data })
    );
    const response = await apiVnpay({ total: totalPayment, locale: "vn" });
    // navigate(`/${path.CHECKOUT_SUCCESS}`);
    window.location.href = response;
    // window.open(response)
  };

  useEffect(() => {
    if (currentCart.length === 0) {
      navigate(`/${path.MEMBER}/${path.HISTORY}`);
    }
  }, [currentCart]);

  useEffect(() => {
    titleRef.current.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div className="w-full mb-12">
      {isSuccess && <Congrat></Congrat>}
      <div
        ref={titleRef}
        className="h-[81px] mt-4 flex justify-center items-center bg-gray-50"
      >
        <div className="w-main">
          <span className="font-semibold text-[18px]">Checkout</span>
          <div className="mt-2">
            <Breadcrumbs></Breadcrumbs>
          </div>
        </div>
      </div>
      <div className="mt-4 w-main mx-auto">
        <div className=" outline-dashed outline-1 outline-offset-1 py-2 pl-4 rounded-lg flex flex-col gap-1">
          <div className="flex gap-2">
            <span className="flex items-center justify-center">
              <IoLocation size={18} color="red"></IoLocation>
            </span>
            <span className="text-lg text-red-500">Delivery Address</span>
          </div>
          <div className="flex gap-4">
            <span className="font-semibold">
              {current?.lastname +
                " " +
                current?.firstname +
                " (" +
                current?.mobile +
                ")"}
            </span>
            <span>{current?.address?.main_name_place}</span>
            <span
              onClick={() => navigate(`/${path.MEMBER}/${path.PERSONAL}`)}
              className="p-1 ml-7 hover:bg-gray-300 rounded-full cursor-pointer text-blue-500 hover:text-red-500"
            >
              <TbExchange size={18}></TbExchange>
            </span>
          </div>
        </div>
        <div className="w-main mx-auto mt-4 my-8 outline-dashed outline-gray-300 outline-1 outline-offset-1">
          <div className="py-4 border mx-auto bg-gray-200 w-main">
            <div className="font-semibold flex ">
              <span className="px-4 flex-1 w-full text-center">#</span>
              <span className="px-4 flex-8 w-full text-center">Products</span>
              <span className="px-4 flex-4 w-full text-center">Color</span>
              <span className="px-4 flex-6 w-full text-center">Unit price</span>
              <span className="px-4 flex-6 w-full text-center">
                Original price
              </span>
              <span className="px-4 flex-4 w-full text-center"> Quantity</span>
              <span className="px-4 flex-6 w-full text-center">
                Amount of money
              </span>
            </div>
          </div>
          <div>
            {currentCart?.map((e, index) => (
              <div key={index}>
                <div
                  className="border-t border-b flex w-full mt-1 py-3 mx-auto bg-gray-50
                "
                >
                  <span className="px-4 flex-1 text-sm w-full text-center flex items-center justify-center">
                    {index}
                  </span>
                  <span className="px-4 flex-8 w-full text-center flex justify-start items-center">
                    <div className="flex gap-2 pl-8  items-center ">
                      <img
                        src={e?.thumbnail}
                        alt="thumb"
                        className="w-10 h-10 object-cover rounded-lg"
                      ></img>
                      <div className="flex items-start gap-1 ml-2">
                        <span className=" text-sm">{e?.title}</span>
                      </div>
                    </div>
                  </span>
                  <span className="px-4 flex-4 text-sm w-full text-center flex justify-center items-center">
                    <span className="flex gap-3 items-center justify-start">
                      <span>
                        {e?.color?.slice(0, 1).toUpperCase() +
                          e?.color?.slice(1)}
                      </span>
                      <span
                        className={`w-3 h-3 ${getColorClass(
                          e?.color
                        )} border rounded-lg`}
                      ></span>
                    </span>
                  </span>
                  <span className="px-4 flex-6 text-sm text-main w-full text-center flex justify-center items-center">
                    {formatMoney(e?.price) + " vnd"}
                  </span>

                  <span className="px-4 flex-6 w-full text-center text-sm text-gray-500 line-through flex justify-center items-center">
                    {formatMoney(
                      Math.ceil((e?.price / (100 - (e.discount || 0))) * 100)
                    )}{" "}
                    vnd
                  </span>

                  <span className="px-4 flex-4 text-sm w-full text-center flex justify-center items-center">
                    {e?.quantity}
                  </span>
                  <span className="px-4 text-main font-semibold flex-6 w-full text-sm flex justify-end pr-4 items-center">
                    {formatMoney(e?.price * e?.quantity) + " vnd"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center py-2 px-4 border-t border-dashed mt-1 bg-gray-50">
            <span>
              <span className="text-sm text-red-500">
                Total price (
                {currentCart?.reduce((sum, el) => +el?.quantity + sum, 0)}{" "}
                products)
              </span>
            </span>
            <span className="text-sm text-red-500">
              {`${formatMoney(totalPrice)} vnd`}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 px-4 border-t border-dashed bg-gray-50">
            <span>
              <span className="text-sm text-red-500">Shop's Coupons</span>
            </span>
            <span className="text-sm text-red-500">
              - 2% Discount ({`- ${formatMoney(coupons)} vnd`})
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-dashed py-2 px-4 bg-gray-50">
            <span>
              <span className="text-sm text-red-500">Estimated taxes</span>
            </span>
            <span className="text-sm text-red-500">
              5% Tax ({`${formatMoney(tax)} vnd`})
            </span>
          </div>

          <div className="flex pl-4 bg-gray-100 outline-dashed outline-1 outline-gray-300 outline-offset-1 py-2">
            <div className="flex-3 border-r border-dashed mr-4 flex flex-col gap-2">
              <span className="text-sm">Message:</span>
              <div className="">
                <textarea
                  onChange={handleTextareaChange}
                  placeholder="Note to sellers..."
                  className="bg-gray-200 p-2 text-sm rounded-lg w-[93%] h-[80px]"
                ></textarea>
              </div>
            </div>
            <div className="flex-5 flex flex-col gap-2">
              <div className="flex border-b border-dashed pb-2 mr-4">
                <div className="flex-3 text-sm">Shipping unit:</div>
                <div className="flex-7 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Fast</p>
                    <span className="flex gap-2 items-center justify-center">
                      <span className="line-through text-xs text-gray-500">
                        60.000 vnd
                      </span>
                      <span className="text-sm text-main">30.000 vnd</span>
                    </span>
                  </div>
                  <p className="text-xs text-green-600">
                    Guaranteed delivery from April 15 - April 17
                  </p>
                  <p className="text-xs text-gray-500 pr-[150px]">
                    Receive a Voucher worth vnd 10,000 if your order is
                    delivered to you after 11:59 p.m. April 17, 2025.
                  </p>
                </div>
              </div>
              <div className="text-sm">Jointly checked.</div>
            </div>
          </div>
          <div className="bg-gray-100">
            <span className="flex gap-4 justify-end items-center p-4">
              <span className="text-sm">Total payment:</span>
              <span className="text-main  font-semibold">
                {`${formatMoney(totalPayment)} vnd`}
              </span>
            </span>
          </div>
        </div>
        <div className="bg-gray-50 outline-gray-300 outline-dashed outline-1 outline-offset-1 py-2  mt-4 pl-4 flex justify-start items-center gap-4">
          <span className="text-lg text-red-500">Payment methods:</span>
          {!paymentMethods && (
            <div className="flex gap-2">
              <div
                className="text-blue-500 hover:text-orange-400 w-[205px] cursor-pointer hover:bg-gray-300 py-1 px-2 rounded-full hover:font-semibold"
                onClick={() => setPaymentMethods("Payment upon delivery")}
              >
                Payment upon delivery
              </div>
              <div
                className="text-blue-500 hover:text-orange-400 w-[190px] cursor-pointer hover:bg-gray-300 py-1 px-2 rounded-full hover:font-semibold"
                onClick={() => setPaymentMethods("Paying through bank")}
              >
                Paying through bank
              </div>
            </div>
          )}
          {paymentMethods && (
            <div className="flex gap-10 items-center">
              <div className="font-semibold p-1">{paymentMethods}</div>
              <div
                onClick={() => setPaymentMethods(null)}
                className="p-1 hover:bg-gray-300 rounded-full cursor-pointer text-blue-500 hover:text-red-500"
              >
                <TbExchange size={18}></TbExchange>
              </div>
            </div>
          )}
        </div>
        {paymentMethods === "Payment upon delivery" && (
          <div className="flex justify-between mt-4 items-center gap-4">
            <li className="text-xs text-gray-500">
              Clicking "Place Order" means you agree to comply with the Shop
              Terms
            </li>
            <Button handleOnClick={handleSaveOrder}>Place Order</Button>
          </div>
        )}
        {paymentMethods === "Paying through bank" && (
          <div className="flex justify-between items-center mt-4 gap-4">
            <li className="text-xs">
              Clicking "Place Order" means you agree to comply with the Shop
              Terms
            </li>
            <Button
              handleOnClick={handleVnpay}
              style={
                " px-4 py-2 my-2 rounded-md text-white bg-gray-400 hover:bg-gray-500"
              }
            >
              <span>Place Order With</span>
              <span className="text-red-600 font-semibold"> VN</span>
              <span className="text-blue-600 font-semibold">PAY</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default withBase(memo(DetailCheckout));

import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatMoney, getColorClass } from "../../ultils/helper";
import payment from "../../assets/payment.svg";
import icons from "../../ultils/icons";
import Button from "../../components/buttons/Button";
import withBase from "../../hocs/withBase";
import path from "../../ultils/path";
import { apiCreateOrder, apiVnpay } from "../../apis";
import { getCurrent } from "../../store/users/asyncAction";
import Swal from "sweetalert2";
import Congrat from "../../components/common/Congrat";
import { addressStore } from "../../ultils/contants"; // Import danh sách addressStore

const Checkout = ({ navigate, dispatch }) => {
  const { IoLocation, TbExchange } = icons;

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

  const data = {
    products: currentCart,
    totalPriceProducts: totalPrice,
    transportFee: 30000,
    tax: tax,
    coupons: coupons,
    total: totalPayment,
    message: textareaValue,
    address: current?.address,
    paymentMethods: paymentMethods,
  };

  const handleSaveOrder = async () => {
    // Lấy tọa độ của người dùng
    const userLat = current?.address?.latitude;
    const userLon = current?.address?.longitude;

    // Tìm địa chỉ gần nhất
    const nearestAddress = findNearestAddress(userLat, userLon);

    // Cập nhật dữ liệu hóa đơn
    const data = {
      products: currentCart,
      totalPriceProducts: totalPrice,
      transportFee: 30000,
      tax: tax,
      coupons: coupons,
      total: totalPayment,
      message: textareaValue,
      shippingAddress: {
        main_name_place: nearestAddress?.main_name_place,
        description: nearestAddress?.description,
        latitude: nearestAddress.latitude,
        longitude: nearestAddress.longitude,
      }, // Địa chỉ giao hàng gần nhất
      billingAddress: current?.address, // Địa chỉ nhận hàng của người dùng
      paymentMethods: paymentMethods,
    };

    const response = await apiCreateOrder(data);
    if (response.success) {
      setIsSuccess(true);
      setTimeout(async () => {
        Swal.fire("Congrat!", "Order was created!", "info").then(() => {
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

  return (
    <div className="relative w-full flex flex-col max-h-screen h-full">
      {isSuccess && <Congrat></Congrat>}
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Checkout</span>
      </h1>
      <div className="flex w-full h-full ">
        <div className="w-[55%] px-5 border-r-[1px] h-full pt-[80px] grid grid-rows-11">
          <div className=" h-full flex justify-center row-span-4">
            <img src={payment} alt="paymentImage"></img>
          </div>
          <div className="flex flex-col gap-2 row-span-6">
            <div className="bg-gray-50 outline-dashed outline-2 outline-offset-2 py-2 pl-4 rounded-lg flex flex-col gap-1">
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
                <span>{current?.address.main_name_place}</span>
                {/* Hiển thị thuộc tính name */}
                <span
                  onClick={() => navigate(`/${path.MEMBER}/${path.PERSONAL}`)}
                  className="p-1 ml-7 hover:bg-gray-300 rounded-full cursor-pointer text-blue-500 hover:text-red-500"
                >
                  <TbExchange size={18}></TbExchange>
                </span>
              </div>
            </div>
            <div className="flex mt-4 pl-4 bg-gray-50 outline-dashed outline-2 outline-offset-2 py-2 rounded-lg">
              <div className="flex-3 border-r mr-4 flex flex-col gap-2">
                <span className="text-sm">Message:</span>
                <div className="">
                  <textarea
                    onClick={() => handleTextareaChange()}
                    placeholder="Note to sellers..."
                    className="bg-gray-200 p-2 text-sm rounded-lg w-[93%] h-[100px]"
                  ></textarea>
                </div>
              </div>
              <div className="flex-5 flex flex-col gap-2">
                <div className="flex border-b pb-2 mr-4">
                  <div className="flex-3 text-sm">Shipping unit:</div>
                  <div className="flex-7 flex flex-col gap-2">
                    <p className="text-sm">Fast</p>
                    <p className="text-xs text-green-600">
                      Guaranteed delivery from April 15 - April 17
                    </p>
                    <p className="text-xs text-gray-500">
                      Receive a Voucher worth vnd 10,000 if your order is
                      delivered to you after 11:59 p.m. April 17, 2025.
                    </p>
                  </div>
                </div>
                <div className="text-sm">Jointly checked.</div>
              </div>
            </div>
            <div className="bg-gray-50 outline-dashed outline-2 outline-offset-2 py-2 rounded-lg mt-4 pl-4 flex justify-start items-center gap-4">
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
              <div className="flex justify-between mt-1 items-center gap-4">
                <li className="text-xs text-gray-500">
                  Clicking "Place Order" means you agree to comply with the Shop
                  Terms
                </li>
                <Button handleOnClick={handleSaveOrder}>Place Order</Button>
              </div>
            )}
            {paymentMethods === "Paying through bank" && (
              <div className="flex justify-between items-center mt-1">
                <li className="text-xs">
                  Clicking "Place Order" means you agree to comply with the Shop
                  Terms
                </li>
                <Button
                  handleOnClick={handleVnpay}
                  style={
                    "px-1 py-2 my-2 rounded-md text-white bg-gray-400 hover:bg-gray-500"
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
        <div className="w-[45%] px-5 pt-4 bg-gray-50 grid grid-rows-10 mt-[75px] ">
          <div className=" pb-2 row-span-7 max-h-full overflow-y-auto">
            {currentCart?.map((e) => (
              <div key={e._id} className="flex justify-between mt-1">
                <div className="flex gap-2 p-1 items-center relative">
                  <div className=" border py-2 rounded-lg bg-white">
                    <img
                      src={e?.thumbnail}
                      alt="thumb"
                      className="w-16 h-16 object-cover"
                    ></img>
                  </div>
                  <span className="absolute text-sm bg-gray-500 w-5 h-5 top-0 left-14 opacity-50 text-white rounded-full text-center">
                    {e?.quantity}
                  </span>
                  <div className="flex flex-col">
                    <span className=" text-sm">{e.title}</span>
                    <span className=" flex gap-2 justify-start items-center">
                      <span className="flex gap-3 items-center justify-start">
                        <span className="text-[10px] text-gray-600">
                          {e?.color?.slice(0, 1).toUpperCase() +
                            e?.color?.slice(1)}
                        </span>
                        <span
                          className={`w-2 h-2 ${getColorClass(
                            e?.color
                          )} rounded-lg border`}
                        ></span>
                      </span>
                    </span>
                  </div>
                </div>
                <span className="mr-2 flex flex-col items-end justify-center">
                  <span className="text-sm font-semibold text-main">
                    {formatMoney(e?.price * e?.quantity) + " vnd"}
                  </span>
                  <span className=" text-xs text-gray-500 line-through">
                    {formatMoney(
                      Math.ceil((e?.price / (100 - (e.discount || 0))) * 100)
                    )}{" "}
                    vnd
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="flex pt-4 border-t justify-between mt-4 row-span-3">
            <div className="flex flex-col gap-2 text-sm">
              <span>Subtotal</span>
              <span>Shipping</span>
              <span>Estimated taxes (5%)</span>
              <span>Coupons (2%)</span>
              <span className="text-lg font-semibold">Total</span>
            </div>
            <div className="flex flex-col gap-2 text-sm items-end">
              <span>{`${formatMoney(totalPrice)} vnd`}</span>
              <span>30.000 vnd</span>
              <span>{`${formatMoney(tax)} vnd`}</span>
              <span>{`- ${formatMoney(coupons)} vnd`}</span>
              <span className="text-lg text-red-500 font-semibold">{`${formatMoney(
                totalPayment
              )} vnd`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(Checkout));

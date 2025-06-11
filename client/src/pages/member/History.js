import React, { memo, useEffect, useRef, useState } from "react";
import { apiGetUserOrders, apiUpdateCart } from "../../apis";
import { limit, statusOrders } from "../../ultils/contants";
import { useForm } from "react-hook-form";
import { Button, CustomSelect, InputForm, Pagination } from "../../components";
import useDebounce from "../../hooks/useDebounce";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { formatMoney, getColorClass } from "../../ultils/helper";
import clsx from "clsx";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import withBase from "../../hocs/withBase";
import { getCurrent } from "../../store/users/asyncAction";
import { useSelector } from "react-redux";
import { showCart } from "../../store/app/appSlice";

const History = ({ handleUpdateStatusOrder, resetHistoryOrder, dispatch }) => {
  const { currentCart } = useSelector((state) => state.user);

  const [orders, setOrders] = useState();
  const [count, setCout] = useState(0);

  // console.log(currentCart);
  // const [scroll, setScroll] = useState(() => resetHistoryOrder);

  const titleRef = useRef();

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const queryDebounce = useDebounce(watch("q"), 800);
  const status = watch("myCustomSelect");

  const fetchOrder = async (params) => {
    const response = await apiGetUserOrders({
      ...params,
      limit: limit,
      sort: "-createdAt",
    });
    if (response.success) {
      setCout(response.counts);
      setOrders(response.order);
    } else {
      setCout(0);
      setOrders([]);
    }
  };

  const handleReview = (rvpid, category, title) => {
    if (rvpid) {
      navigate(`/${category}/${rvpid}/${title}`);
    } else {
      Swal.fire("Oops!", "This product is no longer available.", "info");
    }
  };

  const handleRepurchase = async (
    pid,
    color,
    price,
    thumbnail,
    title,
    discount
  ) => {
    if (pid) {
      if (
        currentCart?.find((e) => e.product?._id === pid && e.color === color)
      ) {
        return Swal.fire({
          title: "Almost...",
          text: "Products already in the cart. You want to open cart?",
          icon: "info",
          cancelButtonText: "Not now!",
          showCancelButton: true,
          confirmButtonText: "Open cart.",
        }).then((rs) => {
          if (rs.isConfirmed) dispatch(showCart());
        });
      } else {
        const response = await apiUpdateCart({
          pid,
          quantity: 1,
          color,
          price,
          thumbnail,
          title,
          discount,
        });
        if (response.success) {
          toast.success(response.mes);
          dispatch(getCurrent());
        } else {
          toast.error(response.mes);
        }
      }
    } else {
      Swal.fire("Oops!", "This product is no longer available.", "info");
    }
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchOrder(searchParams);
    // if (scroll === resetHistoryOrder) {
    //   titleRef.current.scrollIntoView({ block: "start" });
    // }
  }, [params, resetHistoryOrder]);

  useEffect(() => {
    titleRef.current.scrollIntoView({ block: "start" });
  }, [params]);

  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDebounce }).toString(),
      });
    } else
      navigate({
        pathname: location.pathname,
      });
  }, [queryDebounce]);

  useEffect(() => {
    if (status) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ status: status.value }).toString(),
      });
    } else {
      reset();
      navigate({
        pathname: location.pathname,
      });
    }
  }, [status]);

  return (
    <div ref={titleRef} className="relative w-full flex flex-col">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>HISTORY</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="flex w-full justify-center items-center">
        <div className="w-main flex justify-end items-center">
          <form className="w-[38%] flex gap-2 ">
            <div className="flex-2">
              {!status && (
                <InputForm
                  id="q"
                  register={register}
                  errors={errors}
                  fullWith
                  placeholder="Search products by id order"
                ></InputForm>
              )}
            </div>
            <div className="flex-1 flex items-center h-[78px]">
              <CustomSelect
                options={statusOrders}
                value={status}
                onChange={(val) => setValue("myCustomSelect", val)}
                wrapClassname="w-[200px]"
              ></CustomSelect>
            </div>
          </form>
        </div>
      </div>
      <div className="">
        {orders?.map((el, index) => (
          <div key={index} className="w-main mx-auto mt-4 mb-12 ">
            <div
              className={clsx(
                "py-2 px-4 mx-auto bg-gray-50  w-main border-t-4",
                el?.status === "Proccessing" && "border-blue-400",
                el?.status === "Cancelled" && "border-red-600",
                el?.status === "Shipping" && "border-yellow-400",
                el?.status === "Successed" && "border-green-400",
                el?.status === "FindDriver" && "border-purple-400",
                el?.status === "DriverPickup" && "border-pink-400"
              )}
            >
              <div className="flex items-center justify-between ">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">
                    #{" "}
                    {index +
                      (params.get("page") - 1 > 0
                        ? params.get("page") - 1
                        : 0) *
                        limit +
                      1}
                  </span>
                  <span className="text-main text-sm font-semibold">
                    Code Bill:
                  </span>
                  <span className="text-sm text-green-600 ">{el?._id}</span>
                  <span className="text-sm">
                    ({moment(el?.updatedAt).format("DD/MM/YYYY")})
                  </span>
                </div>

                <div className="flex flex-col justify-center items-end">
                  {el?.status === "Proccessing" && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-sm pr-2 border-r-2">
                        The seller is preparing the goods
                      </span>
                      <span className="text-blue-400 font-semibold">
                        {el?.status?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {el?.status === "FindDriver" && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-sm pr-2 border-r-2">
                        Waiting for driver to accept the order
                      </span>
                      <span className="text-purple-400 font-semibold">
                        {el?.status?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {el?.status === "DriverPickup" && (
                    <div className="flex items-center gap-2">
                      <span className="text-pink-400 text-sm pr-2 border-r-2">
                        Driver is picking up the goods
                      </span>
                      <span className="text-pink-400 font-semibold">
                        {el?.status?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {el?.status === "Shipping" && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-sm pr-2 border-r-2">
                        Order is being shipped
                      </span>
                      <span className="text-yellow-400 font-semibold">
                        {el?.status?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {el?.status === "Successed" && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm pr-2 border-r-2">
                        Order is being completed
                      </span>
                      <span className="text-green-400 font-semibold">
                        {el?.status?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {el?.status === "Cancelled" && (
                    <div className="flex items-center gap-2">
                      <span className="text-main text-sm pr-2 border-r-2">
                        Order has been cancelled
                      </span>
                      <span className="text-main font-semibold">
                        {el?.status?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-main">{el?.paymentMethods}</div>
                </div>
              </div>
            </div>
            <div className="py-2 border mx-auto bg-gray-200 w-main">
              <div className="font-semibold flex">
                <span className="px-4 flex-1 w-full text-center">#</span>
                <span className="px-4 flex-8 w-full text-center">Products</span>
                <span className="px-4 flex-4 w-full text-center">Color</span>
                <span className="px-4 flex-6 w-full text-center">
                  Unit price
                </span>
                <span className="px-4 flex-6 w-full text-center">
                  Original price
                </span>
                <span className="px-4 flex-4 w-full text-center">
                  {" "}
                  Quantity
                </span>
                <span className="px-4 flex-6 w-full text-center">
                  Amount of money
                </span>
              </div>
            </div>
            <div className="mt-1">
              {el?.products?.map((e, index) => (
                <div key={index}>
                  <div
                    className=" border-b flex w-full py-3 mx-auto bg-gray-50
                "
                  >
                    <span className="px-4 text-sm flex-1 w-full text-center flex items-center justify-center">
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
                    <span className="px-4  flex-6 text-sm text-main w-full text-center flex justify-center items-center">
                      {formatMoney(e?.price) + " vnd"}
                    </span>

                    <span className="px-4  flex-6 w-full text-center text-sm text-gray-500 line-through flex justify-center items-center">
                      {formatMoney(
                        Math.ceil((e?.price / (100 - (e?.discount || 0))) * 100)
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
                  {el?.status === "Successed" && (
                    <div className="px-4 flex gap-2">
                      <Button
                        handleOnClick={() =>
                          handleReview(
                            e?.product?._id,
                            e?.product?.category,
                            e?.product?.title
                          )
                        }
                        style={
                          "px-1 text-xs  my-1 rounded-md text-white bg-main hover:bg-red-600"
                        }
                      >
                        Reviews
                      </Button>
                      <Button
                        handleOnClick={() =>
                          handleRepurchase(
                            e?.product?._id,
                            e?.color,
                            e?.price,
                            e?.thumbnail,
                            e?.title,
                            e?.discount
                          )
                        }
                        style={
                          "px-1 text-xs my-1 rounded-md text-white bg-main hover:bg-red-600"
                        }
                      >
                        Repurchase
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center py-1 px-4 border-t border-dashed mt-[1px] bg-gray-50">
              <span>
                <span className="text-sm text-red-500">Transport fee</span>
              </span>
              <span className="text-sm text-red-500">
                {`${formatMoney(el?.transportFee)} vnd`}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 px-4 border-t border-dashed mt-[1px] bg-gray-50">
              <span>
                <span className="text-sm text-red-500">
                  Total price (
                  {el?.products?.reduce((sum, el) => +el?.quantity + sum, 0)}{" "}
                  products)
                </span>
              </span>
              <span className="text-sm text-red-500">
                {`${formatMoney(el?.totalPriceProducts)} vnd`}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 px-4 border-t border-dashed bg-gray-50">
              <span>
                <span className="text-sm text-red-500">Shop's coupons</span>
              </span>
              <span className="text-sm text-red-500">
                - 2% Discount ({`- ${formatMoney(el?.coupons)} vnd`})
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-dashed py-1 px-4 bg-gray-50">
              <span>
                <span className="text-sm text-red-500">Estimated taxes</span>
              </span>
              <span className="text-sm text-red-500">
                5% Tax ({`${formatMoney(el?.tax)} vnd`})
              </span>
            </div>

            {/* <div className="flex pl-4 bg-gray-100 outline-dashed outline-1 outline-gray-300 outline-offset-1 py-2">
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
            </div> */}
            <div className="bg-gray-100">
              <div className="flex gap-4 justify-between items-center">
                {el?.status === "Successed" && (
                  <li className="text-gray-400 text-xs pl-1">
                    Please rate the product to receive a discount code.
                  </li>
                )}
                <div></div>
                <div className="flex gap-2 items-center">
                  {el?.status === "Proccessing" && (
                    <Button
                      handleOnClick={() =>
                        handleUpdateStatusOrder({
                          _id: el._id,
                          status: "Cancelled",
                        })
                      }
                      style={
                        " text-sm p-2 my-2 rounded-md text-white bg-main hover:bg-red-600"
                      }
                    >
                      Cancel Order
                    </Button>
                  )}
                  <span className="flex gap-4 justify-end items-center p-2">
                    <span className="text-sm">Total payment:</span>
                    <span className="text-main  font-semibold">
                      {`${formatMoney(el?.total)} vnd`}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="w-main flex justify-end mb-10">
          <Pagination totalCount={count}></Pagination>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default withBase(memo(History));

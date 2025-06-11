import React, { memo, useEffect, useRef, useState } from "react";
import { apiGetAdminOrders } from "../../apis";
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

const ManageOrder = ({
  handleUpdateStatusOrder,
  resetHistoryOrder,
  handleFindDriver,
}) => {
  const [orders, setOrders] = useState();
  const [count, setCout] = useState(0);

  const titleRef = useRef();

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const location = useLocation();

  // const [scroll, setScroll] = useState(() => resetHistoryOrder);

  const {
    register,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  const queryDebounce = useDebounce(watch("q"), 800);
  const status = watch("myCustomSelect");

  const fetchOrder = async (params) => {
    const response = await apiGetAdminOrders({
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

  return (
    <div ref={titleRef} className="relative w-full flex flex-col mb-[100px]">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>HISTORY</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="flex justify-center items-center">
        <div className="w-main flex justify-end items-center">
          <form className="w-[38%] flex gap-2  ">
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
                <div className="flex flex-col">
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
                  <div className="flex gap-2 mt-2 font-semibold">
                    <div className="text-sm">
                      {el?.orderBy?.lastname} {el?.orderBy?.firstname} (
                      {el?.orderBy?.mobile})
                    </div>
                    <div className="text-sm">{el?.address}</div>
                  </div>
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
                          )} rounded-lg border`}
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

            {/* <div className="flex justify-between items-center py-1 px-4 border-t border-dashed mt-[1px] bg-gray-50">
              <span>
                <span className="text-sm text-red-500">Transport fee</span>
              </span>
              <span className="text-sm text-red-500">
                {`${formatMoney(el?.transportFee)} vnd`}
              </span>
            </div> */}

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
            <div className="bg-gray-100">
              <div className="flex gap-4 justify-end items-center">
                <div className="flex gap-2 items-center">
                  {el?.status === "Proccessing" && (
                    <Button
                      handleOnClick={() =>
                        handleFindDriver({
                          _id: el._id,
                          status: "FindDriver",
                        })
                      }
                      style={
                        " text-sm p-2 my-2 rounded-md text-white bg-main hover:bg-red-600"
                      }
                    >
                      Find Driver
                    </Button>
                  )}
                  {el?.status === "FindDriver" && (
                    <Button
                      handleOnClick={() =>
                        handleUpdateStatusOrder({
                          _id: el._id,
                          status: "Proccessing",
                        })
                      }
                      style={
                        " text-sm p-2 my-2 rounded-md text-white bg-main hover:bg-red-600"
                      }
                    >
                      Cancel Find Driver
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
        <div className="w-main flex justify-end">
          <Pagination totalCount={count}></Pagination>
        </div>
      </div>
    </div>
  );
};

export default memo(ManageOrder);

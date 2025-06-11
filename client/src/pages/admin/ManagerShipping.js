import React, { useEffect, useRef, useState } from "react";
import { CustomSelect, InputForm, Pagination } from "../../components";
import { limit, statusShipping } from "../../ultils/contants";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { useForm } from "react-hook-form";
import { apiGetAdminShippings } from "../../apis";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";

export default function ManagerShipping(resetHistoryOrder) {
  const [orders, setOrders] = useState([]);
  const [count, setCout] = useState(0);
  const titleRef = useRef();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { current } = useSelector((state) => state.user);

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
    const response = await apiGetAdminShippings({
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

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const completedCount = statusCounts["COMPLETED"] || 0;
  const canceledCount = statusCounts["CANCELED"] || 0;
  const shippingCount = statusCounts["SHIPPING"] || 0;
  const pendingCount = statusCounts["PENDING"] || 0;

  // const doughnutData = {
  //   labels: ["Completed", "Canceled", "Shipping", "Pending"],
  //   datasets: [
  //     {
  //       data: [completedCount, canceledCount, shippingCount, pendingCount],
  //       backgroundColor: [
  //         "#4ade80", // light green
  //         "#60a5fa", // light blue
  //         "#facc15", // light yellow
  //         "#a3a3a3", // light gray
  //       ],
  //       borderWidth: 2,
  //     },
  //   ],
  // };

  // Total orders
  const totalOrders = orders.length;

  // Total revenue (only completed orders)
  const totalRevenue = current?.balence || 0;

  const percentCompleted =
    totalOrders > 0 ? Math.round((completedCount / totalOrders) * 100) : 0;

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
        <span>SHIPPING ORDERS</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="flex justify-center items-center">
        <div className="w-main mt-5 mb-1 pl-10 flex items-center justify-between ">
          {/* Thông tin tổng hợp */}
          <div className="flex items-center gap-8">
            <div className="w-28 h-28 relative flex items-center justify-center">
              <Doughnut
                data={{
                  labels: ["Hoàn thành", "Đã hủy", "Đang giao", "Chờ xử lý"],
                  datasets: [
                    {
                      data: [
                        completedCount,
                        canceledCount,
                        shippingCount,
                        pendingCount,
                      ],
                      backgroundColor: [
                        "#4ade80", // xanh lá nhạt
                        "#60a5fa", // xanh dương nhạt
                        "#facc15", // vàng nhạt
                        "#a3a3a3", // xám nhạt
                      ],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  cutout: "70%",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-green-600">
                  {percentCompleted}%
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600">
                {totalOrders}
              </span>
              <span className="text-xs text-gray-500">Total orders</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-orange-500">
                {totalRevenue.toLocaleString("en-US")} đ
              </span>
              <span className="text-xs text-gray-500">Total revenue</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600">
                {completedCount}
              </span>
              <span className="text-xs text-gray-500">Completed orders</span>
            </div>
          </div>
          {/* Form tìm kiếm */}
          <form className="w-[41%] flex gap-2">
            <div className="flex-2">
              {!status && (
                <InputForm
                  id="q"
                  register={register}
                  errors={errors}
                  fullWith
                  placeholder="Search by receiver or driver"
                />
              )}
            </div>
            <div className="flex-1 flex items-center h-[78px]">
              <CustomSelect
                options={statusShipping}
                value={status}
                onChange={(val) => setValue("myCustomSelect", val)}
                wrapClassname="w-[200px]"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="w-main mx-auto mt-5">
        <div className="bg-[#374151] text-white font-semibold grid grid-cols-12 py-3 px-4 text-center rounded-t-md border border-gray-300">
          <div className="col-span-1">#</div>
          <div className="col-span-1">Receiver</div>
          <div className="col-span-1">User</div>
          <div className="col-span-2">Driver</div>
          <div className="col-span-2">Pickup Address</div>
          <div className="col-span-2">Destination</div>
          <div className="col-span-1">Distance</div>
          <div className="col-span-1">Cost</div>
          <div className="col-span-1">Status</div>
        </div>
        {orders && orders.length > 0 ? (
          orders.map((order, idx) => (
            <div
              key={order._id}
              className="grid grid-cols-12 items-center border-x border-b border-gray-300 bg-white hover:bg-gray-100 transition py-3 px-4 text-center text-[15px] last:rounded-b-md"
            >
              <div className="col-span-1 text-xs break-all">
                {idx + 1} # {order._id}
              </div>
              <div className="col-span-1">
                <div className="font-medium">{order.infReceiver?.name}</div>
                <div className="text-xs text-gray-500">
                  {order.infReceiver?.mobile}
                </div>
              </div>
              <div className="col-span-1">
                <div className="font-medium">
                  {order.userId?.firstname} {order.userId?.lastname}
                </div>
                <div className="text-xs text-gray-500">
                  {order.userId?.mobile}
                </div>
              </div>
              <div className="col-span-2">
                <div className="font-medium">
                  {order.driverId?.firstname} {order.driverId?.lastname}
                </div>
                <div className="text-xs text-gray-500">
                  {order.driverId?.mobile}
                </div>
              </div>
              <div className="col-span-2">
                <div className="font-medium truncate">
                  {order.pickupAddress?.main_name_place}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  <div>Lat: {order.pickupAddress?.latitude}</div>
                  <div>Lng: {order.pickupAddress?.longitude}</div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="font-medium truncate">
                  {order.destinationAddress?.main_name_place}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  <div>Lat: {order.destinationAddress?.latitude}</div>
                  <div>Lng: {order.destinationAddress?.longitude}</div>
                </div>
              </div>
              <div className="col-span-1 font-semibold text-blue-700">
                {order.distanceInKilometers}
              </div>
              <div className="col-span-1 font-semibold text-green-600">
                {order.cost?.toLocaleString("vi-VN")} đ
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                order.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : order.status === "CANCELED"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }
            `}
                >
                  {order.status}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {moment(order.updatedAt).format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 bg-white border-x border-b border-gray-300 rounded-b-md">
            No shipping orders found.
          </div>
        )}
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="w-main flex justify-end">
          <Pagination totalCount={count}></Pagination>
        </div>
      </div>
    </div>
  );
}

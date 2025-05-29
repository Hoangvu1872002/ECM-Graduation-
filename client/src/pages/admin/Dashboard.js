import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Pie, Bar, Line } from "react-chartjs-2";
import { apiGetAllOrders, apiGetProducts, apiGetUsers } from "../../apis";
import { CustomSelect } from "../../components";
import { useForm } from "react-hook-form";
import { formatMoney } from "../../ultils/helper";
import icons from "../../ultils/icons";

const Dashboard = () => {
  const { GiMoneyStack, RiProductHuntLine, RiBillLine, LuUsers2 } = icons;

  const [orders, setOrders] = useState();
  const [weeklyDataPrice, setWeeklyDataPrice] = useState();
  const [weeklyDataOrder, setWeeklyDataOrder] = useState();
  const [monthData, setMonthData] = useState();
  const [countProducts, setCountProducts] = useState(0);
  const [users, setUsers] = useState();
  // const [monthHighest, setMonthHighest] = useState();

  const { watch, setValue } = useForm();

  const statusPrice = watch("myCustomSelectPrice");
  const statusOrder = watch("myCustomSelectOrder");

  const fetchOrder = async () => {
    const response = await apiGetAllOrders();
    if (response.success) {
      setOrders(response.order);
    }
  };

  const countOrdersSuccessed = orders?.filter(
    (e) => e.status === "Successed"
  ).length;
  const countOrdersCancelled = orders?.filter(
    (e) => e.status === "Cancelled"
  ).length;
  const countOrdersProccessing = orders?.filter(
    (e) => e.status === "Proccessing"
  ).length;
  const countOrdersShipping = orders?.filter(
    (e) => e.status === "Shipping"
  ).length;

  let month = [
    {
      title: "January",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 1,
    },
    {
      title: "February",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 2,
    },
    {
      title: "March",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 3,
    },
    {
      title: "April",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 4,
    },
    {
      title: "May",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 5,
    },
    {
      title: "June",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 6,
    },
    {
      title: "July",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 7,
    },
    {
      title: "August",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 8,
    },
    {
      title: "September",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 9,
    },
    {
      title: "October",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 10,
    },
    {
      title: "November",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 11,
    },
    {
      title: "December",
      total: "",
      week: [
        {
          title: "Week One",
          code: 1,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Two",
          code: 2,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Three",
          code: 3,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Four",
          code: 4,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
        {
          title: "Week Five",
          code: 5,
          valueSuccess: [],
          valueCancel: [],
          orderSuccessed: "",
          orderCancelled: "",
          total: "",
        },
      ],
      orderSuccessed: "",
      orderCancelled: "",
      value: 12,
    },
  ];

  const insertData = () => {
    for (let i = 0; i < month.length; i++) {
      const data = orders?.filter(
        (e) => new Date(e.updatedAt).getMonth() + 1 === month[i].value
      );

      const dataOrderSuccess = data?.filter((e) => e.status === "Successed");
      const dataOrderCancel = data?.filter((e) => e.status === "Cancelled");

      if (dataOrderSuccess && dataOrderCancel) {
        dataOrderSuccess?.forEach((item) => {
          const itemDate = new Date(item.updatedAt);
          const weekIndex = Math.floor(itemDate.getDate() / 7);
          month[i].week[weekIndex].valueSuccess.push(item);
        });

        dataOrderCancel?.forEach((item) => {
          const itemDate = new Date(item.updatedAt);
          const weekIndex = Math.floor(itemDate.getDate() / 7);
          month[i].week[weekIndex].valueCancel.push(item);
        });

        for (let j = 0; j < 5; j++) {
          month[i].week[j].total = month[i]?.week[j]?.valueSuccess.reduce(
            (sum, el) => +el?.total + sum,
            0
          );
          month[i].week[j].orderSuccessed = month[i].week[
            j
          ].valueSuccess.filter((e) => e.status === "Successed").length;
          month[i].week[j].orderCancelled = month[i].week[j].valueCancel.filter(
            (e) => e.status === "Cancelled"
          ).length;
          // console.log(month[i].week[j]);
        }
      }
      month[i].total = dataOrderSuccess?.reduce(
        (sum, el) => +el?.total + sum,
        0
      );
      month[i].orderSuccessed = dataOrderSuccess?.length;
      month[i].orderCancelled = dataOrderCancel?.length;
    }
    return month;
  };

  const fetchProduct = async () => {
    const response = await apiGetProducts();
    if (response.success) {
      setCountProducts(response.counts);
    }
  };

  const fectchUsers = async (params) => {
    const response = await apiGetUsers();
    if (response.success) setUsers(response);
  };

  // function timThangCoDoanhThuCaoNhat(danhSachThang) {
  //   if (danhSachThang.length === 0) {
  //     return null;
  //   }

  //   let thangCaoNhat = danhSachThang[0]; // Giả sử tháng đầu tiên có tổng doanh thu cao nhất

  //   for (let i = 1; i < danhSachThang.length; i++) {
  //     if (danhSachThang[i].total > thangCaoNhat.total) {
  //       thangCaoNhat = danhSachThang[i];
  //     }
  //   }

  //   return thangCaoNhat;
  // }

  useEffect(() => {
    fetchOrder();
    fetchProduct();
    fectchUsers();
  }, []);

  useEffect(() => {
    setMonthData(insertData());
  }, [orders]);

  // useEffect(() => {
  //   setMonthHighest(timThangCoDoanhThuCaoNhat(month));
  // }, [monthData]);

  useEffect(() => {
    if (statusPrice) {
      setWeeklyDataPrice(
        monthData.find((e) => e.title === statusPrice.label).week
      );
    } else setWeeklyDataPrice(monthData);
  }, [statusPrice, monthData]);

  useEffect(() => {
    // console.log(statusOrder);
    if (statusOrder) {
      // console.log(monthData?.find((e) => e.title === statusOrder.label).week);
      setWeeklyDataOrder(
        monthData?.find((e) => e.title === statusOrder.label).week
      );
    } else setWeeklyDataOrder(monthData);
  }, [statusOrder, monthData]);

  return (
    <div className="w-full relative h-full">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Dashboard</span>
      </h1>

      <div className="pt-[75px] px-5 h-full w-full ">
        <div className="pt-5 flex flex-col h-full gap-4 w-full">
          <div className="flex-4 w-full flex gap-4">
            <div className="flex-2 py-3 px-4  rounded-xl shadow-md bg-white">
              <div className="flex justify-between border-b pb-3 items-center">
                <span className="text-main font-semibold text-xl py-[5px]">
                  Overview 2024
                </span>
              </div>
              <div className="flex flex-col h-[83%] justify-center items-center w-full mt-5 ">
                <div className="rounded-lg h-[25%]  w-full shadow-md p-2 flex bg-slate-50 ">
                  <div className="flex w-[30%] items-center justify-center text-blue-400">
                    <GiMoneyStack size={40}></GiMoneyStack>
                  </div>
                  <div className="flex w-[70%] flex-col items-start justify-center">
                    <div className="text-gray-500 text-sm font-medium">
                      Total revenue
                    </div>
                    <div className="flex justify-end items-center gap-4 text-blue-400">
                      <span className=" text-xl font-semibold py-2 ">
                        {formatMoney(
                          orders
                            ?.filter((e) => e.status === "Successed")
                            .reduce((sum, el) => +el?.total + sum, 0)
                        )}
                      </span>
                      <span className="font-medium">vnd</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg h-[25%] mt-3 shadow-md  w-full p-2 flex bg-slate-50">
                  <div className="flex w-[30%] items-center justify-center text-red-400">
                    <RiProductHuntLine size={40}></RiProductHuntLine>
                  </div>
                  <div className="flex w-[70%] flex-col items-start justify-center">
                    <div className="text-gray-500 text-sm font-medium">
                      Total products
                    </div>
                    <div className="flex justify-end items-center gap-4 text-red-400">
                      <span className=" text-xl font-semibold py-2 ">
                        {" "}
                        {countProducts}
                      </span>
                      <span className="font-medium">products</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg h-[25%] mt-3 shadow-md  w-full p-2 flex bg-slate-50">
                  <div className="flex w-[30%] items-center justify-center text-yellow-400">
                    <LuUsers2 size={40}></LuUsers2>
                  </div>
                  <div className="flex w-[70%] flex-col items-start justify-center">
                    <div className="text-gray-500 text-sm font-medium">
                      Total users
                    </div>
                    <div className="flex justify-end items-center gap-4 text-yellow-400">
                      <span className=" text-xl font-semibold py-2 ">
                        {users?.counts}
                      </span>
                      <span className="font-medium">members</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg h-[25%] mt-3 shadow-md  w-full p-2 flex bg-slate-50">
                  <div className="flex w-[30%] items-center justify-center text-green-400">
                    <RiBillLine size={40}></RiBillLine>
                  </div>
                  <div className="flex w-[70%] h-[100%] flex-col items-start justify-center">
                    <div className="text-gray-500 text-sm font-medium">
                      Total completed orders
                    </div>
                    <div className="flex justify-end items-center gap-4 text-green-400">
                      <span className=" text-xl font-semibold py-2 ">
                        {countOrdersSuccessed}
                      </span>
                      <span className="font-medium">bills</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-5 py-3 px-4 bg-white rounded-xl shadow-md">
              <div className="flex  justify-between border-b pb-3 items-center">
                <span className="text-main font-semibold text-xl ">
                  Revenue Chart
                </span>
                <form>
                  <CustomSelect
                    options={month?.map((e) => ({
                      label: e.title,
                      value: e.title,
                    }))}
                    value={statusPrice}
                    onChange={(val) => setValue("myCustomSelectPrice", val)}
                    wrapClassname="w-[200px]"
                  ></CustomSelect>
                </form>
              </div>
              <div className="mt-5">
                <Bar
                  data={{
                    labels: weeklyDataPrice?.map((e) => e.title),
                    datasets: [
                      {
                        label:
                          weeklyDataPrice?.map((e) => e.title).length === 12
                            ? "2024 revenue"
                            : `${statusPrice?.label} revenue`,
                        data: weeklyDataPrice?.map((e) => e.total),
                        backgroundColor: "rgb(45 212 191)",
                      },
                    ],
                  }}
                ></Bar>
              </div>
            </div>
          </div>
          <div className="flex-6 w-full">
            <div className="  flex w-full gap-4 h-full pb-5">
              <div className="flex-5 py-3 px-4 bg-white rounded-xl shadow-md">
                <div className="flex justify-between border-b pb-3 items-center">
                  <span className="text-main font-semibold text-xl">
                    Order Frequency Chart
                  </span>
                  <form>
                    <CustomSelect
                      options={month?.map((e) => ({
                        label: e.title,
                        value: e.title,
                      }))}
                      value={statusOrder}
                      onChange={(val) => setValue("myCustomSelectOrder", val)}
                      wrapClassname="w-[200px]"
                    ></CustomSelect>
                  </form>
                </div>
                <div className="mt-5">
                  <Line
                    data={{
                      labels: weeklyDataOrder?.map((e) => e.title),
                      datasets: [
                        {
                          label: "Successed",
                          data: weeklyDataOrder?.map((e) => e.orderSuccessed),
                          borderColor: "rgb(74, 222, 128)",
                          // fill: false,
                          // tension: 0.2,
                        },
                        {
                          label: "Cancelled",
                          data: weeklyDataOrder?.map((e) => e.orderCancelled),
                          borderColor: "rgb(248, 113, 113)",
                          // fill: false,
                          // tension: 0.2,
                        },
                      ],
                    }}
                  ></Line>
                </div>
              </div>
              <div className="flex-2 py-3 px-4 bg-white rounded-xl  shadow-md">
                <div className="flex justify-start border-b pb-3 items-center">
                  <span className="text-main font-semibold text-xl py-[5px]">
                    Order Status Chart
                  </span>
                </div>
                <div className="flex justify-center items-center mt-[10%]">
                  <Pie
                    data={{
                      labels: [
                        "Proccessing",
                        "Shipping",
                        "Successed",
                        "Cancelled",
                      ],
                      datasets: [
                        {
                          label: "Revenue",
                          data: [
                            countOrdersProccessing,
                            countOrdersShipping,
                            countOrdersSuccessed,
                            countOrdersCancelled,
                          ],
                          backgroundColor: [
                            "rgb(96, 165, 250)",
                            "rgb(251, 146, 60)",
                            "rgb(74, 222, 128)",
                            "rgb(248, 113, 113)",
                          ],
                        },
                      ],
                      hoverOffset: 4,
                    }}
                  ></Pie>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

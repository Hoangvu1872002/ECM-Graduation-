import axios from "../axios";

export const apiCreateOrder = (data) =>
  axios({
    url: "/orders",
    method: "post",
    data,
  });

export const apiGetUserOrders = (params) =>
  axios({
    url: "/orders/user",
    method: "get",
    params,
  });

export const apiGetAdminOrders = (params) =>
  axios({
    url: "/orders/admin",
    method: "get",
    params,
  });

export const apiGetAllOrders = () =>
  axios({
    url: "/orders/dashboard",
    method: "get",
  });

export const apiVnpay = (data) =>
  axios({
    url: "/vnpay/create_payment_url",
    method: "post",
    data,
  });

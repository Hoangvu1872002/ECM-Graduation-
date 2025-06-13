import axios from "../axios";

export const apiGetAdminShippings = (params) =>
  axios({
    url: "/shippings/admin",
    method: "get",
    params,
  });

export const apiGetAllShippings = () =>
  axios({
    url: "/shippings/admin/all",
    method: "get",
  });

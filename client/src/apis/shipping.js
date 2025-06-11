import axios from "../axios";

export const apiGetAdminShippings = (params) =>
  axios({
    url: "/shippings/admin",
    method: "get",
    params,
  });

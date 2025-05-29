import axios from "../axios";

export const apiCreateDriver = (data) =>
  axios({
    url: "/drivers/register",
    method: "post",
    data,
  });

export const apiGetDrivers = (params) =>
  axios({
    url: "/drivers/",
    method: "get",
    params,
  });

export const apiDeleteDriver = (did) =>
  axios({
    url: "/drivers/" + did,
    method: "delete",
  });

export const apiUpdateDriver = (data, did) =>
  axios({
    url: "/drivers/" + did,
    method: "put",
    data,
  });

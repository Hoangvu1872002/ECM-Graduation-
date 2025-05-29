import axios from "../axios";

export const apiGetProducts = (params) =>
  axios({
    url: "/products",
    method: "get",
    params,
  });

export const apiGetProduct = (pid) =>
  axios({
    url: "/products/" + pid,
    method: "get",
  });

export const apiRating = (data) =>
  axios({
    url: "/products/rating",
    method: "put",
    data,
  });

export const apiCreateProduct = (data) =>
  axios({
    url: "/products/",
    method: "post",
    data,
  });

export const apiUpdateProduct = (data, pid) =>
  axios({
    url: "/products/" + pid,
    method: "put",
    data,
  });

export const apiDeleteProduct = (pid) =>
  axios({
    url: "/products/" + pid,
    method: "delete",
  });

export const apiAddVarriant = (data, pid) =>
  axios({
    url: "/products/varriant/" + pid,
    method: "put",
    data,
  });

export const apiEditVarriant = (data, pid) =>
  axios({
    url: "/products/varriant/edit/" + pid,
    method: "post",
    data,
  });

export const apiDeleteVarriant = (color, pid) =>
  axios({
    url: "/products/varriant/" + pid + "/" + color,
    method: "delete",
  });

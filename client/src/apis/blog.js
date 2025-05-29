import axios from "../axios";

export const apiCreateBlog = (data) =>
  axios({
    url: "/blogs/",
    method: "post",
    data,
  });

export const apiGetBlogs = (params) =>
  axios({
    url: "/blogs",
    method: "get",
    params,
  });

export const apiDeleteBlog = (bid) =>
  axios({
    url: "/blogs/" + bid,
    method: "delete",
  });

export const apiUpdateBlog = (data, bid) =>
  axios({
    url: "/blogs/" + bid,
    method: "put",
    data,
  });

export const apiGetOneBlog = (bid) =>
  axios({
    url: "/blogs/one-blog/" + bid,
    method: "get",
  });

export const apiLikeBlog = (bid) =>
  axios({
    url: "/blogs/like/" + bid,
    method: "put",
  });

export const apiDislikeBlog = (bid) =>
  axios({
    url: "/blogs/dislike/" + bid,
    method: "put",
  });

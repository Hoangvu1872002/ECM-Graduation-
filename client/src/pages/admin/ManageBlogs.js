import React, { memo, useCallback, useEffect, useState } from "react";
import { apiDeleteBlog, apiGetBlogs } from "../../apis";
import icons from "../../ultils/icons";
import {
  createSearchParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { limit } from "../../ultils/contants";
import moment from "moment";
import { InputForm, Pagination } from "../../components";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import UpdateBlog from "./UpdateBlog";
import useDebounce from "../../hooks/useDebounce";
import withBase from "../../hocs/withBase";

const ManageBlogs = ({ navigate }) => {
  const [count, setCout] = useState(0);
  const [blogs, setBlogs] = useState();
  const [editBlog, setEditBlog] = useState();
  const [update, setUpdate] = useState(false);

  const location = useLocation();

  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const { MdDeleteForever, FaRegEdit } = icons;

  const [params] = useSearchParams();

  const fetchBlogs = async (params) => {
    const response = await apiGetBlogs({
      ...params,
      limit,
    });
    if (response.success) {
      setCout(response.blogs.length);
      setBlogs(response.blogs);
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  });

  const queryDebounce = useDebounce(watch("q"), 800);

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

  const handleDeleteBlog = (bid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure remove this product",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteBlog(bid);
        if (response.success) toast.success(response.mes);
        else toast.error(response.mes);
        render();
      }
    });
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchBlogs(searchParams);
  }, [update, params]);

  return (
    <div className="w-full relative mb-[100px]">
      {editBlog && (
        <div className="absolute z-20 insert-0 min-h-full min-w-full bg-gray-100">
          <UpdateBlog
            toast={toast}
            editBlog={editBlog}
            setEditBlog={setEditBlog}
            render={render}
          ></UpdateBlog>
        </div>
      )}
      <h1 className="fixed z-10 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Manage Blog</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="flex w-full justify-end items-center px-5">
        <form className="w-[30%]">
          <InputForm
            id="q"
            register={register}
            fullWith
            errors={errors}
            placeholder="Search products by title"
          ></InputForm>
        </form>
      </div>
      <div className="px-5">
        <table className="table-auto mb-6 text-left w-full ">
          <thead className="font-bold bg-gray-700 text-[13px]  text-white">
            <tr className="border border-gray-500">
              <th className="px-4 py-2">#</th>
              <th className="px-2 py-2">Thumb</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-2 py-2">Like</th>
              <th className="px-2 py-2">Dislike</th>
              <th className="px-2 py-2">View</th>
              <th className="px-2 py-2">CreatedAt</th>
              <th className="px-2 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {blogs?.map((e, index) => (
              <tr key={e._id} className="border border-gray-500">
                <td className="px-4 py-2">
                  {index +
                    (params.get("page") - 1 > 0 ? params.get("page") - 1 : 0) *
                      limit +
                    1}
                </td>
                <td className="px-2 py-2">
                  <img
                    src={e.thumb}
                    alt="thumb"
                    className="w-16 h-16 object-cover"
                  ></img>
                </td>
                <td className="px-4 py-2 max-w-[130px]">{e.title}</td>
                <td className="px-2 py-2">{e.likes.length || 0}</td>
                <td className="px-2 py-2">{e.dislikes.length || 0}</td>
                <td className="px-2 py-2">{e.numberViews}</td>
                <td className="px-2 py-2">
                  {moment(e.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="px-2 py-2  h-full">
                  <div className="flex gap-4 justify-start items-center h-full">
                    <span
                      onClick={() => {
                        setEditBlog(e);
                        window.scrollTo(0, 0);
                      }}
                      className="pl-1 inline-block text-blue-500 hover:text-orange-600 cursor-pointer"
                    >
                      <FaRegEdit size={20}></FaRegEdit>
                    </span>
                    <span
                      onClick={() => handleDeleteBlog(e._id)}
                      className="pl-1 inline-block text-blue-500 hover:text-orange-600 cursor-pointer"
                    >
                      <MdDeleteForever size={20}></MdDeleteForever>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end mb-10 px-5">
        <Pagination totalCount={count}></Pagination>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default withBase(memo(ManageBlogs));

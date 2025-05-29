import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination } from "../../components";
import { useForm } from "react-hook-form";
import { apiDeleteProduct, apiGetProducts } from "../../apis";
import moment from "moment";
import { limit } from "../../ultils/contants";
import { ToastContainer, toast } from "react-toastify";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import icons from "../../ultils/icons";
import { apiDeleteDriver, apiGetDrivers } from "../../apis/driver";
import UpdateDriver from "./UpdateDriver";

const ManageDriver = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const { MdDeleteForever, FaRegEdit, BiCustomize } = icons;

  const navigate = useNavigate();
  const location = useLocation();

  const [params] = useSearchParams();

  const [products, setProducts] = useState();
  const [count, setCout] = useState(0);
  const [editProduct, setEditProduct] = useState();
  const [update, setUpdate] = useState(false);

  const render = useCallback(() => {
    setUpdate(!update);
  });

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure remove this account driver",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteDriver(pid);
        if (response.success) toast.success(response.mes);
        else toast.error(response.mes);
        render();
      }
    });
  };

  const fetchProduct = async (params) => {
    const response = await apiGetDrivers({ ...params, limit });

    if (response.success) {
      setCout(response.counts);
      setProducts(response.drivers);
    }
  };

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

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProduct(searchParams);
  }, [params, update]);
  return (
    <div className="w-full flex flex-col gap-3 relative mb-[100px]">
      {editProduct && (
        <div className="absolute z-20 insert-0 min-h-full min-w-full bg-gray-100">
          <UpdateDriver
            toast={toast}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            render={render}
          ></UpdateDriver>
        </div>
      )}
      <h1 className="fixed z-10 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Manage Products</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="flex w-full justify-end items-center px-5">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWith
            placeholder="Search driver ..."
          ></InputForm>
        </form>
      </div>
      <div className="px-5">
        <table className="table-auto mb-6 text-left w-full ">
          <thead className="font-bold bg-gray-700 text-[13px]  text-white">
            <tr className="border border-gray-500">
              <th className="px-4 py-2">#</th>
              <th className="px-2 py-2">Avatar</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Firstname</th>
              <th className="px-2 py-2">Lastname</th>
              <th className="px-2 py-2">Mobile</th>
              <th className="px-2 py-2">Vehicle brand</th>
              <th className="px-1 py-2">Travel mode</th>
              <th className="px-2 py-2">License plate</th>
              <th className="px-2 py-2">Total Rating</th>
              <th className="px-2 py-2">Date Create</th>
              <th className="px-2 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((e, index) => (
              <tr key={e._id} className="border border-gray-500">
                <td className="px-4 py-2">
                  {index +
                    (params.get("page") - 1 > 0 ? params.get("page") - 1 : 0) *
                      limit +
                    1}
                </td>
                <td className="px-2 py-2">
                  <img
                    src={e.avatar}
                    alt="avatar"
                    className="w-12 h12 object-cover"
                  ></img>
                </td>
                <td className="px-2 py-2 w-[150px] line-clamp-1 ">{e.email}</td>
                <td className="px-2 py-2">{e.firstname}</td>
                <td className="px-2 py-2">{e.lastname}</td>
                <td className="px-2 py-2">{e.mobile}</td>
                <td className="px-2 py-2">{e.vehicleBrand}</td>
                <td className="px-2 py-2">{e.travelMode}</td>
                <td className="px-2 py-2">{e.licensePlate}</td>
                <td className="px-1 text-center py-2">{e.totalRating}</td>
                <td className="px-2 py-2">
                  {moment(e.createAt).format("DD/MM/YY")}
                </td>
                <td className="px-2 py-2">
                  <span
                    onClick={() => {
                      setEditProduct(e);
                      window.scrollTo(0, 0);
                    }}
                    className="pl-1 inline-block text-blue-500 hover:text-orange-600 cursor-pointer"
                  >
                    <FaRegEdit size={20}></FaRegEdit>
                  </span>
                  <span
                    onClick={() => handleDeleteProduct(e._id)}
                    className="pl-1 inline-block text-blue-500 hover:text-orange-600 cursor-pointer"
                  >
                    <MdDeleteForever size={20}></MdDeleteForever>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end px-5">
        <Pagination totalCount={count}></Pagination>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default ManageDriver;

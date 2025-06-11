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
  const [selectedDriver, setSelectedDriver] = useState(null);

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
        <table className="table-auto mb-6 w-full text-[15px]">
          <thead>
            <tr className="bg-[#374151] text-white font-bold rounded-t-md">
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-2 py-3 text-center">Avatar</th>
              <th className="px-2 py-3 text-center">Email</th>
              <th className="px-2 py-3 text-center">Firstname</th>
              <th className="px-2 py-3 text-center">Lastname</th>
              <th className="px-2 py-3 text-center">Mobile</th>
              <th className="px-2 py-3 text-center">Vehicle brand</th>
              <th className="px-1 py-3 text-center">Travel mode</th>
              <th className="px-2 py-3 text-center">License plate</th>
              <th className="px-2 py-3 text-center">Total Rating</th>
              <th className="px-2 py-3 text-center">Date Create</th>
              <th className="px-2 py-3 text-center">Active</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((e, index) => (
              <tr
                key={e._id}
                className="border-b border-x border-gray-300 bg-white hover:bg-gray-100 transition-all cursor-pointer"
                onClick={() => setSelectedDriver(e)}
              >
                <td className="px-4 py-3 text-center align-middle">
                  {index +
                    (params.get("page") - 1 > 0 ? params.get("page") - 1 : 0) *
                      limit +
                    1}
                </td>
                <td className="px-2 py-3 text-center align-middle">
                  <img
                    src={e.avatar}
                    alt="avatar"
                    className="w-12 h-12 object-cover rounded-full mx-auto"
                  />
                </td>
                <td className="px-2 py-3 w-[150px] align-middle break-all text-center">
                  {e.email}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  {e.firstname}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  {e.lastname}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  {e.mobile}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  {e.vehicleBrand}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  {e.travelMode}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  {e.licensePlate}
                </td>
                <td className="px-1 py-3 align-middle text-center">
                  {e.totalRating}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  {moment(e.createAt).format("DD/MM/YY")}
                </td>
                <td className="px-2 py-3 align-middle text-center">
                  <span
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setEditProduct(e);
                      window.scrollTo(0, 0);
                    }}
                    className="pl-1 inline-block text-blue-500 hover:text-orange-600 cursor-pointer"
                  >
                    <FaRegEdit size={20} />
                  </span>
                  <span
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDeleteProduct(e._id);
                    }}
                    className="pl-1 inline-block text-blue-500 hover:text-orange-600 cursor-pointer"
                  >
                    <MdDeleteForever size={20} />
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
      {/* Modal hiển thị chi tiết */}
      {selectedDriver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setSelectedDriver(null)} // Bấm nền sẽ tắt modal
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-w-[90vw] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Bấm trong modal không tắt
          >
            <h2 className="text-xl font-bold mb-4">Driver Detail</h2>
            <div className="flex flex-col gap-2">
              <img
                src={selectedDriver.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full mx-auto"
              />
              <div>
                <b>Email:</b> {selectedDriver.email}
              </div>
              <div>
                <b>Name:</b> {selectedDriver.firstname}{" "}
                {selectedDriver.lastname}
              </div>
              <div>
                <b>Mobile:</b> {selectedDriver.mobile}
              </div>
              <div>
                <b>Vehicle Brand:</b> {selectedDriver.vehicleBrand}
              </div>
              <div>
                <b>Travel Mode:</b> {selectedDriver.travelMode}
              </div>
              <div>
                <b>License Plate:</b> {selectedDriver.licensePlate}
              </div>
              <div>
                <b>Total Rating:</b> {selectedDriver.totalRating}
              </div>
              <div>
                <b>Date Create:</b>{" "}
                {moment(selectedDriver.createAt).format("DD/MM/YY")}
              </div>
            </div>
            {/* Danh sách đánh giá */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-lg">Ratings</h3>
              {selectedDriver.ratings && selectedDriver.ratings.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedDriver.ratings.map((rating, idx) => (
                    <li key={idx} className="border rounded p-2 bg-gray-50">
                      <div>
                        <b>Star:</b> {rating.star}
                      </div>
                      <div>
                        <b>Comment:</b> {rating.comment || "Không có bình luận"}
                      </div>
                      <div>
                        <b>By:</b> {rating.postedBy || "Ẩn danh"}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">Chưa có đánh giá nào.</div>
              )}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedDriver(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDriver;

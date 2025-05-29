import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteUser, apiGetUsers, apiUpdateUser } from "../../apis/user";
import moment from "moment";
import InputField from "../../components/inputs/InputField";
import useDebounce from "../../hooks/useDebounce";
import Pagination from "../../components/pagination/Pagination";
import { limit } from "../../ultils/contants";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, InputForm, Select } from "../../components";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { roles, blockStatus } from "../../ultils/contants";

const ManageUser = () => {
  const [users, setUsers] = useState();
  const [queries, setQueries] = useState({
    q: "",
  });
  const [editElm, setEditElm] = useState();
  const [update, setUpdate] = useState(false);

  const [params] = useSearchParams();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    mobile: "",
    address: "",
    isBocked: "",
  });

  const fectchUsers = async (params) => {
    const response = await apiGetUsers({ ...params, limit: limit });
    if (response.success) setUsers(response);
  };

  const queriesDebounce = useDebounce(queries.q, 800);

  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editElm._id);
    if (response.success) {
      setEditElm(null);
      render();
      toast.success(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Are you sure...",
      text: "Are you ready remove this user?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUser(uid);
        if (response.success) {
          render();
          toast.success(response.mes, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error(response.mes, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    });
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fectchUsers(queries);
  }, [queriesDebounce, params, update]);

  useEffect(() => {
    // console.log(editElm.isBocked);
    if (editElm)
      reset({
        email: editElm?.email,
        firstname: editElm?.firstname,
        lastname: editElm?.lastname,
        role: editElm?.role,
        mobile: editElm?.mobile,
        address: editElm?.address,
        isBocked: editElm?.isBocked,
      });
  }, [editElm]);
  return (
    <div className="w-full relative mb-[100px]">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Manage User</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="w-full px-5">
        <div className="flex justify-end p-2 mt-2">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style="w500"
            placeholder="Search name or email user..."
            isShowLaybel
          ></InputField>
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {/* <div className="h-[50px]">
            {editElm && <Button type="submit">Update</Button>}
          </div> */}
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-gray-700 text-[13px]  text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-1 py-2">Email address</th>
                <th className="px-1 py-2">Firstname</th>
                <th className="px-1 py-2">Lastname</th>
                <th className="px-1 py-2">Role</th>
                <th className="px-1 py-2">Phone</th>
                <th className="px-1 py-2">Order address</th>
                <th className="px-1 py-2">Status</th>
                <th className="px-1 py-2">Created At</th>
                <th className="px-1 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((e, index) => (
                <tr key={e._id} className="border border-gray-500">
                  <td className="px-4 py-2">
                    {index +
                      (params.get("page") - 1 > 0
                        ? params.get("page") - 1
                        : 0) *
                        limit +
                      1}
                  </td>
                  <td className="px-1 py-2 w-[150px] line-clamp-1 truncate">
                    {editElm?._id === e._id ? (
                      <InputForm
                        register={register}
                        fullWith
                        errors={errors}
                        id={"email"}
                        defaultValue={editElm?.email}
                        // style='w110'
                        validate={{
                          required: "Required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        }}
                      ></InputForm>
                    ) : (
                      <span>{e.email}</span>
                    )}
                  </td>
                  <td className="px-1 py-2 w-[10%]">
                    {editElm?._id === e._id ? (
                      <InputForm
                        register={register}
                        fullWith
                        errors={errors}
                        id={"lastname"}
                        defaultValue={editElm?.firstname}
                        validate={{ required: "Required" }}
                      ></InputForm>
                    ) : (
                      <span>{e.firstname}</span>
                    )}
                  </td>
                  <td className="px-1 py-2 w-[10%] ">
                    {editElm?._id === e._id ? (
                      <InputForm
                        register={register}
                        fullWith
                        errors={errors}
                        id={"firstname"}
                        defaultValue={editElm?.lastname}
                        validate={{ required: "Required" }}
                      ></InputForm>
                    ) : (
                      <span>{e.lastname}</span>
                    )}
                  </td>
                  <td className="px-1 py-2">
                    {editElm?._id === e._id ? (
                      <Select
                        register={register}
                        fullWith
                        style="w110"
                        errors={errors}
                        id={"role"}
                        defaultValue={editElm?.role}
                        validate={{ required: "Required" }}
                        options={roles}
                      ></Select>
                    ) : (
                      <span>{e.role}</span>
                    )}
                  </td>
                  <td className="px-1 py-2 w-[10%]">
                    {editElm?._id === e._id ? (
                      <InputForm
                        register={register}
                        fullWith
                        errors={errors}
                        id={"mobile"}
                        defaultValue={editElm?.mobile}
                        validate={{
                          required: "Required",
                          pattern: {
                            value: /^[62|0]+\d{2}/gi,
                            message: "invalid phone number",
                          },
                        }}
                      ></InputForm>
                    ) : (
                      <span>{e.mobile}</span>
                    )}
                  </td>
                  <td className="px-1 py-2 w-[150px] line-clamp-1 truncate ">
                    {editElm?._id === e._id ? (
                      <InputForm
                        register={register}
                        fullWith
                        errors={errors}
                        id={"address"}
                        defaultValue={editElm?.address.name}
                        validate={{
                          required: "Required",
                        }}
                      ></InputForm>
                    ) : (
                      <span>{e.address.name}</span>
                    )}
                  </td>
                  <td className="px-1 py-2">
                    {editElm?._id === e._id ? (
                      <Select
                        register={register}
                        fullWith
                        style="w110"
                        errors={errors}
                        id={"isBocked"}
                        defaultValue={editElm.isBocked}
                        validate={{ required: "Required" }}
                        options={blockStatus}
                      ></Select>
                    ) : (
                      <span>{e.isBocked}</span>
                    )}
                  </td>
                  <td className="px-1 py-2">
                    {moment(e.createdAt).format("DD/MM/YY")}
                  </td>
                  <td className="px-1 py-2">
                    {editElm?._id === e._id ? (
                      <span className="">
                        <Button
                          type="submit"
                          style="px-2 py-1 mr-1 my-2 rounded-md text-white bg-main text-seminold"
                        >
                          Update
                        </Button>
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setEditElm(e);
                          console.log(e);
                        }}
                        className="pr-2 text-orange-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </span>
                    )}
                    {editElm?._id === e._id ? (
                      <span className="">
                        <Button
                          handleOnClick={() => setEditElm(null)}
                          style="px-1 py-1 my-2 rounded-md text-white bg-black text-seminold"
                        >
                          Back
                        </Button>
                      </span>
                    ) : (
                      <span
                        onClick={() => handleDeleteUser(e._id)}
                        className="pl-1 text-orange-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-end">
          <Pagination totalCount={users?.counts}></Pagination>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default ManageUser;

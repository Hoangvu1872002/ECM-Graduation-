import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  InputForm,
  Loading,
  MarkdownEditor,
  Select,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { validate, getBase64 } from "../../ultils/helper";
import { ToastContainer, toast } from "react-toastify";
import icons from "../../ultils/icons";
import { apiCreateProduct } from "../../apis";
import { showModal } from "../../store/app/appSlice";
import { colors } from "../../ultils/contants";
import { apiCreateDriver } from "../../apis/driver";

const CreateDriver = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    vehicleBrand: "",
    travelMode: "",
    avatar: null,
  });
  const dispatch = useDispatch();

  const [update, setUpdate] = useState();

  const [preview, setPreview] = useState({
    avatar: null,
  });

  const handleCreateProduct = async (data) => {
    const formData = new FormData();
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);
    if (data.avatar) formData.append("avatar", data.avatar[0]);
    dispatch(
      showModal({ isShowModal: true, modalChildren: <Loading></Loading> })
    );
    const response = await apiCreateDriver(formData);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      toast.success(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
      reset();
    } else {
      toast.error(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handlePreviewAvatar = async (file) => {
    const base64Avatar = await getBase64(file);
    setPreview((prev) => ({ ...prev, avatar: base64Avatar }));
  };

  useEffect(() => {
    handlePreviewAvatar(watch("avatar")[0]);
  }, [watch("avatar")]);

  return (
    <div className="w-full relative">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Create Account Driver</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <div className="w-full flex mb-6 gap-4">
            <InputForm
              label="Firstname"
              register={register}
              errors={errors}
              id="firstname"
              style="flex-1"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="Firstname of new driver"
            />

            <InputForm
              label="Lastname"
              register={register}
              errors={errors}
              id="lastname"
              style="flex-1"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="Lastname of new driver"
            />
          </div>
          <div className="w-full flex my-6 gap-4">
            <InputForm
              label="Email"
              register={register}
              errors={errors}
              id="email"
              style="flex-1"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="email of new driver"
            />

            <InputForm
              label="Mobile"
              register={register}
              errors={errors}
              id="mobile"
              style="flex-1"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="Mobile of new driver"
            />
            <InputForm
              label="Password"
              register={register}
              errors={errors}
              id="password"
              style="flex-1"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="Password of new driver"
            />
          </div>

          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Vehicle brand"
              register={register}
              errors={errors}
              id="vehicleBrand"
              style="flex-1"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="Vehicle brand of new driver"
            />
            <InputForm
              label="License plate"
              register={register}
              errors={errors}
              id="licensePlate"
              style="flex-1"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="License plate of new driver"
            />
            <Select
              label="Travel mode (Optional)"
              options={["Bike", "Car", "BikePlus", "CarFamily"].map((e) => ({
                value: e,
              }))}
              register={register}
              id={"travelMode"}
              validate={{ required: "Need fill this field" }}
              style="flex-auto"
              errors={errors}
              fullwidth
            ></Select>
          </div>

          <div className="mb-8">
            <div className="flex flex-col gap-2 mt-8">
              <label className="font-medium" htmlFor="thumb">
                Upload avatar:
              </label>
              <input
                type="file"
                id="avatar"
                {...register("avatar", { required: "Need fill" })}
              ></input>
              {errors["avatar"] && (
                <small className="text-xs text-red-500">
                  {errors["avatar"]?.message}
                </small>
              )}
            </div>
            {preview.avatar && (
              <div className="my-4">
                <img
                  src={preview?.avatar}
                  alt="avatar"
                  className="w-[200px] object-contain"
                ></img>
              </div>
            )}
          </div>

          <Button type="submit">Create new account driver</Button>
        </form>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default CreateDriver;

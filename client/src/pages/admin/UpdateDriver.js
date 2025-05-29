import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Button,
  InputForm,
  Loading,
  MarkdownEditor,
  Select,
} from "../../components";
import { useForm } from "react-hook-form";
import { getBase64, validate } from "../../ultils/helper";
import { showModal } from "../../store/app/appSlice";
import { apiUpdateProduct } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { apiCreateDriver, apiUpdateDriver } from "../../apis/driver";

const UpdateDriver = ({ editProduct, setEditProduct, render, toast }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const dispatch = useDispatch();

  const [preview, setPreview] = useState({
    thumb: null,
  });

  const handlePreviewAvatar = async (file) => {
    const base64Avatar = await getBase64(file);
    setPreview((prev) => ({ ...prev, avatar: base64Avatar }));
  };

  const handleUpdateDriver = async (data) => {
    const formData = new FormData();
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);
    if (data.avatar) formData.append("avatar", data.avatar[0]);
    dispatch(
      showModal({ isShowModal: true, modalChildren: <Loading></Loading> })
    );
    const response = await apiUpdateDriver(formData, editProduct._id);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      toast.success(response.mes);
      render();
      setEditProduct(null);
    } else {
      toast.error(response.mes);
    }
  };

  useEffect(() => {
    reset({
      firstname: editProduct?.firstname || "",
      lastname: editProduct?.lastname || "",
      email: editProduct?.email || "",
      mobile: editProduct?.mobile || "",
      password: "",
      vehicleBrand: editProduct?.vehicleBrand || "",
      licensePlate: editProduct?.licensePlate || "",
      travelMode: editProduct?.travelMode || "",
    });
    setPreview({
      avatar: editProduct?.avatar || "",
    });
  }, [editProduct]);

  useEffect(() => {
    if (watch("avatar") instanceof FileList && watch("avatar").length > 0)
      handlePreviewAvatar(watch("avatar")[0]);
  }, [watch("avatar")]);

  return (
    <div className="w-full relative">
      <div className="flex w-full">
        <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
          <span>Update account driver</span>
        </h1>
        <div className="flex fixed z-50 top-2 right-4 font-semibold">
          <Button handleOnClick={() => setEditProduct(null)}>Cancel</Button>
        </div>
      </div>
      <div className="h-[75px] w-full"></div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateDriver)}>
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
              <input type="file" id="avatar" {...register("avatar")}></input>
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

          <Button type="submit">Update account driver</Button>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateDriver);

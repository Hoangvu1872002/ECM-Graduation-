import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import avatar from "../../assets/avatarDefault.png";
import { apiUpdateCurrent } from "../../apis";
import { getCurrent } from "../../store/users/asyncAction";
import { ToastContainer, toast } from "react-toastify";
import ModalSetLocation from "../../components/location/ModalSetLocation";
import { showModal } from "../../store/app/appSlice";

const Personal = () => {
  const {
    register,
    formState: { errors, isDirty },
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);

  const handleUpdateInf = async (data) => {
    const formData = new FormData();

    // Xử lý avatar nếu có
    if (data.avatar.length > 0) formData.append("avatar", data.avatar[0]);
    delete data.avatar;

    // Chuyển đổi đối tượng address thành chuỗi JSON
    if (data.address) {
      formData.append("address", JSON.stringify(data.address));
    }

    // Thêm các trường khác vào FormData
    for (let [key, value] of Object.entries(data)) {
      if (key !== "address") {
        formData.append(key, value);
      }
    }

    console.log("FormData:", formData.get("address")); // Kiểm tra giá trị address

    const response = await apiUpdateCurrent(formData);

    if (response.success) {
      toast.success(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
      dispatch(getCurrent());
    } else {
      toast.error(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      email: current?.email,
      address: current?.address?.main_name_place,
      avatar: current?.avatar,
    });
  }, [current]);
  return (
    <div className="relative w-full flex flex-col">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Personal</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <form
        onSubmit={handleSubmit(handleUpdateInf)}
        className="w-3/5 mx-auto py-8 flex flex-col gap-4"
      >
        <InputForm
          label="Firstname"
          register={register}
          errors={errors}
          id="firstname"
          validate={{
            required: "Need fill this field",
          }}
        />
        <InputForm
          label="Lastname"
          register={register}
          errors={errors}
          id="lastname"
          validate={{
            required: "Need fill this field",
          }}
        />
        <InputForm
          label="Email"
          register={register}
          errors={errors}
          id="email"
          validate={{
            required: "Need fill this field",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: "Email inavalid.",
            },
          }}
        />

        <InputForm
          label="Address"
          value={watch("address")?.main_name_place} // Chỉ hiển thị trường "name" trong ô input
          register={register}
          errors={errors}
          onClick={() => {
            dispatch(
              showModal({
                isShowModal: true,
                modalChildren: (
                  <ModalSetLocation
                    onClose={() =>
                      dispatch(
                        showModal({ isShowModal: false, modalChildren: null })
                      )
                    }
                    onSelect={(location) => {
                      // Lưu toàn bộ đối tượng vào form
                      setValue(
                        "address",
                        {
                          main_name_place: location.main_name_place,
                          description: location.description,
                          latitude: location.lat,
                          longitude: location.lng, // Sửa "location" thành "longitude" để đúng với schema
                        },
                        {
                          shouldDirty: true, // Đánh dấu trường là "dirty"
                        }
                      );
                    }}
                  />
                ),
              })
            );
          }}
          readOnly={true} // Không cho phép nhập trực tiếp
          id="address"
          validate={{
            required: "Need fill this field",
          }}
        />

        <InputForm
          label="Phone"
          register={register}
          errors={errors}
          id="mobile"
          validate={{
            required: "Need fill this field",
            pattern: {
              value:
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
              message: "Phone inavalid.",
            },
          }}
        />
        <div className="flex items-center gap-4">
          <span className="font-medium">Account Status:</span>
          <span>{current?.isBlocked ? "Blocked" : "Actived"}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Role:</span>
          <span>{current?.role === "admin" ? "Admin" : "User"}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Created At:</span>
          <span>{moment(current?.createdAt).fromNow("DD/MM/YY")}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Avatar image:</span>
          <label htmlFor="file">
            <img
              src={current?.avatar || avatar}
              alt="logo"
              className="w-20 h-20 object-cover rounded-full border hover:border-2 hover:border-gray-500"
            ></img>
          </label>
          <input type="file" id="file" {...register("avatar")} hidden></input>
        </div>
        {isDirty && (
          <div className="w-full flex justify-end">
            <Button type="submit">Update Information</Button>
          </div>
        )}
      </form>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default Personal;

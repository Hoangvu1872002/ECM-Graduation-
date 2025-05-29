import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm, Loading, MarkdownEditor } from "../../components";
import { useDispatch } from "react-redux";
import { validate, getBase64 } from "../../ultils/helper";
import { ToastContainer, toast } from "react-toastify";
import { apiCreateBlog } from "../../apis";
import { showModal } from "../../store/app/appSlice";

const CreateBlog = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm({
    title: "",
    thumb: null,
    description: "",
  });

  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    description: "",
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handleCreateBlog = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      // if (data.category)
      //   data.category = categories?.find((e) => e._id === data.category)?.title;
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      // console.log(finalPayload);
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      // dispatch(
      //   showModal({ isShowModal: true, modalChildren: <Loading></Loading> })
      // );
      const response = await apiCreateBlog(formData);
      // dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        toast.success(response.mes, {
          position: toast.POSITION.TOP_RIGHT,
        });
        reset();
        setPayload({
          description: "",
        });
      } else {
        toast.error(response.mes, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  useEffect(() => {
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  return (
    <div className="w-full relative">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Create Blog</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="p-4">
        <form
          className=" h-full flex flex-col gap-4"
          onSubmit={handleSubmit(handleCreateBlog)}
        >
          <div className="pb-4">
            <InputForm
              label="Name blog"
              register={register}
              errors={errors}
              id="title"
              validate={{
                required: "Need fill this field",
              }}
              fullWith
              placeholder="Name of new blog"
            />
          </div>
          <div className="">
            <MarkdownEditor
              name="description"
              changeValue={changeValue}
              label={"Description"}
              setInvalidFields={setInvalidFields}
              invalidFields={invalidFields}
            ></MarkdownEditor>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label className="font-medium pl-[1px]" htmlFor="thumb">
              Upload thumb:
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb", { required: "Need fill" })}
            ></input>
            {errors["thumb"] && (
              <small className="text-xs text-red-500">
                {errors["thumb"]?.message}
              </small>
            )}
          </div>
          {preview.thumb && (
            <div className="my-4">
              <img
                src={preview?.thumb}
                alt="thumbnail"
                className="w-[200px] object-contain"
              ></img>
            </div>
          )}
          <div className="mt-4">
            <Button type="submit">Create new blog</Button>
          </div>
        </form>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default CreateBlog;

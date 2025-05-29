import React, { memo, useCallback, useEffect, useState } from "react";
import { Button, InputForm, MarkdownEditor } from "../../components";
import { useForm } from "react-hook-form";
import { getBase64, validate } from "../../ultils/helper";

import { apiUpdateBlog } from "../../apis";

const UpdateBlog = ({ toast, editBlog, setEditBlog, render }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const [payload, setPayload] = useState({
    description: "",
  });

  const [preview, setPreview] = useState({
    thumb: null,
  });

  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      // if (data.category)
      //   data.category = categories?.find((e) => e._id === data.category)?.title;
      const finalPayload = { ...data, ...payload };
      finalPayload.thumb =
        data?.thumb.length === 0 ? preview.thumb : data.thumb[0];
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      // console.log(finalPayload);
      // dispatch(showModal({isShowModal: true, modalChildren: <Loading></Loading>}))
      const response = await apiUpdateBlog(formData, editBlog._id);
      // dispatch(showModal({ isShowModal: false, modalChildren: null }));
      // console.log(response);
      if (response.success) {
        toast.success(response.mes);
        render();
        setEditBlog(null);
      } else {
        toast.error(response.mes);
      }
    }
  };

  useEffect(() => {
    reset({
      title: editBlog?.title || "",
    });
    setPayload({
      description:
        typeof editBlog?.description === "object"
          ? editBlog?.description?.join(",")
          : editBlog?.description,
    });
    setPreview({
      thumb: editBlog?.thumb || "",
    });
  }, [editBlog]);

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  return (
    <div>
      <div className="flex w-full">
        <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
          <span>Update Blog</span>
        </h1>
        <div className="flex fixed z-50 top-2 right-4 font-semibold">
          <Button handleOnClick={() => setEditBlog(null)}>Cancel</Button>
        </div>
      </div>

      <div className="h-[75px] w-full"></div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label="Name product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
            }}
            fullWith
            placeholder="Name of new product"
          />
          <MarkdownEditor
            name="description"
            changeValue={changeValue}
            label={"Description"}
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            value={payload?.description}
          ></MarkdownEditor>
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">
              Upload thumb
            </label>
            <input type="file" id="thumb" {...register("thumb")}></input>
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

          <Button type="submit">Update blog</Button>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateBlog);

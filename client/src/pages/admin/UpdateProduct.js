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
import { colors } from "../../ultils/contants";

const UpdateProduct = ({ editProduct, setEditProduct, render, toast }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.app);

  const [payload, setPayload] = useState({
    description: "",
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [invalidFields, setInvalidFields] = useState([]);
  const [isFocusDescription, setIsFocusDescription] = useState();

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

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.error("File not supported", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
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
      finalPayload.images =
        data?.images.length === 0 ? preview.images : data.images;
      for (let image of finalPayload.images) formData.append("images", image);
      // dispatch(showModal({isShowModal: true, modalChildren: <Loading></Loading>}))
      const response = await apiUpdateProduct(formData, editProduct._id);
      // dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        toast.success(response.mes);
        render();
        setEditProduct(null);
      } else {
        toast.error(response.mes);
      }
    }
  };

  useEffect(() => {
    reset({
      title: editProduct?.title || "",
      price: editProduct?.price || "",
      quantity: editProduct?.quantity || "",
      color: editProduct?.color || "",
      category: editProduct?.category || "",
      discount: editProduct?.discount || "",
      brand: editProduct?.brand?.toLowerCase() || "",
    });
    setPayload({
      description:
        typeof editProduct?.description === "object"
          ? editProduct?.description?.join(",")
          : editProduct?.description,
    });
    setPreview({
      thumb: editProduct?.thumb || "",
      images: editProduct?.images || [],
    });
  }, [editProduct]);

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0)
      handlePreviewImages(watch("images"));
  }, [watch("images")]);

  return (
    <div className="w-full relative">
      <div className="flex w-full">
        <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
          <span>Update Product</span>
        </h1>
        <div className="flex fixed z-50 top-2 right-4 font-semibold">
          <Button handleOnClick={() => setEditProduct(null)}>Cancel</Button>
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
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-1"
              placeholder="Price of new product"
              type="number"
            />
            <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-1"
              placeholder="Quantity of new product"
              type="number"
            />

            <InputForm
              label="Discount"
              register={register}
              errors={errors}
              id="discount"
              validate={{
                required: "Required",
                pattern: {
                  value: /^(?:[1-9][0-9]?|0)$/,
                  message: "Invalid discount",
                },
              }}
              style="flex-1"
              placeholder="Discount of new product"
              type="number"
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Category (Optional)"
              options={categories?.map((e) => ({
                value: e.title,
              }))}
              register={register}
              id={"category"}
              validate={{ required: "Need fill this field" }}
              style="flex-auto"
              errors={errors}
              fullwidth
            ></Select>
            <Select
              label="Brand (Optional)"
              options={categories
                ?.find((el) => el.title === watch("category"))
                ?.brand?.map((item) => ({
                  value: item?.toLowerCase(),
                }))}
              register={register}
              id={"brand"}
              validate={{ required: "Need fill this field" }}
              style="flex-auto"
              errors={errors}
              fullwidth
            ></Select>
            <Select
              label="Color (Optional)"
              options={colors?.map((e) => ({
                value: e,
              }))}
              register={register}
              id={"color"}
              validate={{ required: "Need fill this field" }}
              style="flex-auto"
              errors={errors}
              fullwidth
            ></Select>
          </div>
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
          <div className="flex flex-col gap-2 mt-8 mb-8">
            <label className="font-semibold" htmlFor="thumb">
              Upload images of product
            </label>
            <input
              type="file"
              id="images"
              {...register("images")}
              multiple
            ></input>
            {/* <label htmlFor="file">Choose a file</label> */}
            {errors["images"] && (
              <small className="text-xs text-red-500">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preview.images.length > 0 && (
            <div className="my-4 flex gap-3 flex-wrap">
              {preview.images?.map((e, index) => (
                <div
                  key={index}
                  className="w-fit relative"
                  // onMouseEnter={() => setHoverElm(e.name)}
                  // onMouseLeave={() => setHoverElm(null)}
                >
                  <img
                    src={e}
                    alt="product"
                    className="w-[200px] object-contain"
                  ></img>
                </div>
              ))}
            </div>
          )}
          <Button type="submit">Update new product</Button>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);

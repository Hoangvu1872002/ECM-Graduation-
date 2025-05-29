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

const CreateProduct = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm({
    title: "",
    price: "",
    category: "",
    discount: "",
    brand: "",
    thumb: null,
    color: "",
    images: [],
  });

  const { categories } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const { ImBin } = icons;

  // const discountNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]

  const [update, setUpdate] = useState();
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

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      // if (data.category)
      //   data.category = categories?.find((e) => e._id === data.category)?.title;
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      // console.log(finalPayload);
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append("images", image);
      }
      dispatch(
        showModal({ isShowModal: true, modalChildren: <Loading></Loading> })
      );
      const response = await apiCreateProduct(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        toast.success(response.mes, {
          position: toast.POSITION.TOP_RIGHT,
        });
        reset();
        setPayload({ description: "" });
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
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  // const handleRemoveImage = (name) => {
  //   const files = [...watch('images')]
  //   console.log(files.filter(e => e.name !== name));
  //   reset({
  //     images: files.filter(e => e.name !== name)
  //   })
  //   if (preview.images?.some((e) => e.name === name)) {
  //     setPreview((prev) => ({
  //       ...prev,
  //       images: prev.images?.filter((el) => el.name !== name),
  //     }));
  //   }
  // };

  useEffect(() => {
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);

  return (
    <div className="w-full relative">
      <h1 className="fixed z-50 bg-gray-100 w-full h-[75px] flex justify-between items-center text-3xl font-bold px-5 border-b">
        <span>Create Product</span>
      </h1>
      <div className="h-[75px] w-full"></div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
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
            {/* <InputForm
              label="Color"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-1"
              placeholder="Color of new product"
            /> */}
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
                  value: item,
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
          ></MarkdownEditor>
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-medium" htmlFor="thumb">
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
          <div className="flex flex-col gap-2 mt-8 mb-8">
            <label className="font-medium" htmlFor="thumb">
              Upload images of product:
            </label>
            <input
              type="file"
              id="images"
              {...register("images", { required: "Need fill" })}
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
                    src={e.path}
                    alt="product"
                    className="w-[200px] object-contain"
                  ></img>
                  {/* {hoverElm === e.name && (
                    <div
                      onClick={() => {
                        handleRemoveImage(e.name);
                      }}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-overlay"
                    >
                      <ImBin size={24} color="white"></ImBin>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}
          <Button type="submit">Create new product</Button>
        </form>
      </div>
      {/* <ToastContainer autoClose={1200} /> */}
    </div>
  );
};

export default CreateProduct;

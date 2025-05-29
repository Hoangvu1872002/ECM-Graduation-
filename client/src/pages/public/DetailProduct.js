import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { createSearchParams, useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts, apiUpdateCart } from "../../apis";
import {
  Breadcrumbs,
  Button,
  CustomSlider,
  ProductExtrainfo,
  ProductInfo,
  SelectQuantity,
} from "../../components";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import { addressStore, productExtrainfoData } from "../../ultils/contants";
import {
  formatMoney,
  fotmatPrice,
  getColorClass,
  renderStarFromNumber,
} from "../../ultils/helper";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import withBase from "../../hocs/withBase";
import path from "../../ultils/path";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { getCurrent } from "../../store/users/asyncAction";
import { showCart } from "../../store/app/appSlice";
import icons from "../../ultils/icons";

const settings = {
  dots: false,
  infinite: false,
  speed: 800,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const DetailProduct = ({ isQuickView, data, navigate, dispatch, location }) => {
  const params = useParams();
  const titleRef = useRef();

  const { FaPhoneAlt, IoLocation } = icons;

  const { current, currentCart } = useSelector((state) => state.user);

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState();
  const [currentImage, setCurrentImage] = useState();
  const [pid, setPid] = useState();
  const [update, setUpdate] = useState(false);
  const [varriant, setVarriant] = useState();
  const [currentProduct, setCurentProduct] = useState([
    {
      title: "",
      thumb: "",
      price: "",
      sold: "",
      quantity: "",
      images: [],
      color: "",
    },
  ]);
  const [resetQuantity, setResetQuantity] = useState();

  const fetchProductData = async () => {
    const responese = await apiGetProduct(pid);
    if (responese.success) {
      setProduct(responese.productData);
      setCurrentImage(responese?.productData?.thumb);
    }
    // console.log(responese.productData);
  };
  const category = params?.category || data?.category;

  const fetchProducts = async () => {
    const responese = await apiGetProducts({ category });
    if (responese.success) setRelatedProducts(responese.products);
  };

  const handleClickImage = (el, e) => {
    // e.stopProppagation();
    setCurrentImage(e);
  };

  const handleQuantity = useCallback(
    (number) => {
      setResetQuantity(quantity);
      if (!Number(number) || Number(number) < 1) {
        return;
      } else setQuantity(number);
    },
    [quantity]
  );

  const handleAddtoCart = async () => {
    if (!current) {
      return Swal.fire({
        title: "Almost...",
        text: "Please login first!",
        icon: "info",
        cancelButtonText: "Not now!",
        showCancelButton: true,
        confirmButtonText: "Go login page.",
      }).then((rs) => {
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
      });
    }
    const response = await apiUpdateCart({
      pid,
      quantity,
      color: currentProduct?.color || product?.color || " ",
      price: currentProduct?.price || product?.price,
      thumbnail: currentProduct?.thumb || product?.thumb,
      title: currentProduct?.title || product?.title,
      discount: product?.discount,
    });
    if (response.success) {
      toast.success(response.mes);
      setQuantity(1);
      dispatch(getCurrent());
    } else {
      // toast.error(response.mes);
      if (response.notEnough) {
        Swal.fire("Oops!", response.mes, "error").then(() => {
          setQuantity(resetQuantity);
        });
      } else {
        toast.error(response.mes);
      }
    }
  };

  const handleOutStock = (e) => {
    // e.stopPropagation();
    Swal.fire("Oops!", "This product is currently out of stock.", "info");
  };

  const handleShowCart = () => {
    return Swal.fire({
      title: "Almost...",
      text: "Products already in the cart. You want to open cart?",
      icon: "info",
      cancelButtonText: "Not now!",
      showCancelButton: true,
      confirmButtonText: "Open cart.",
    }).then((rs) => {
      if (rs.isConfirmed) dispatch(showCart());
    });
  };

  const rerender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [update]);

  useEffect(() => {
    if (data && data.pid) {
      setPid(data.pid);
    } else if (params && params.pid) {
      setPid(params.pid);
      titleRef.current.scrollIntoView({ block: "start" });
    }
  }, [data, params]);

  const handleChangeQuantity = (flag) => {
    setResetQuantity(quantity);
    if (flag === "minus" && quantity === 1) return;
    if (flag === "minus") setQuantity((prev) => +prev - 1);
    if (flag === "plus") setQuantity((prev) => +prev + 1);
  };
  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
  }, [pid]);

  // console.log( product?.varriants?.find((e) => e.sku === varriant));
  // console.log(currentProduct);

  useEffect(() => {
    setCurentProduct({
      title: product?.varriants?.find((e) => e.sku === varriant)?.title || "",
      color: product?.varriants?.find((e) => e.sku === varriant)?.color || "",
      price: product?.varriants?.find((e) => e.sku === varriant)?.price || "",
      sold:
        product?.varriants?.find((e) => e.sku === varriant)?.sold === 1
          ? 1
          : 0 || product?.varriants?.find((e) => e.sku === varriant)?.sold === 0
          ? 0
          : product?.varriants?.find((e) => e.sku === varriant)?.sold > 1
          ? product?.varriants?.find((e) => e.sku === varriant)?.sold
          : "",
      quantity:
        product?.varriants?.find((e) => e.sku === varriant)?.quantity === 1
          ? 1
          : 0 ||
            product?.varriants?.find((e) => e.sku === varriant)?.quantity === 0
          ? 0
          : product?.varriants?.find((e) => e.sku === varriant)?.quantity > 1
          ? product?.varriants?.find((e) => e.sku === varriant)?.quantity
          : "",
      images: product?.varriants?.find((e) => e.sku === varriant)?.images || [],
      thumb: product?.varriants?.find((e) => e.sku === varriant)?.thumb || "",
    });
    setCurrentImage(
      product?.varriants?.find((e) => e.sku === varriant)?.thumb ||
        product.thumb
    );
    if (params && params.pid) {
      titleRef.current.scrollIntoView({ block: "start" });
    }
    // titleRef.current.scrollIntoView({ block: "start" });
  }, [varriant]);

  // console.log(currentProduct.quantity);
  // console.log(currentProduct);

  // useEffect(() => {
  //   modalRefQuickView.current.scrollIntoView({
  //     block: isQuickView && "start",
  //     behavior: "smooth",
  //   });
  // }, [data, params]);
  // console.log(product);
  return (
    <div className={clsx(`w-full`, isQuickView && "")}>
      {!isQuickView && (
        <div
          ref={titleRef}
          className="h-[81px] mt-4 flex justify-center items-center bg-gray-50"
        >
          <div className="w-main">
            <span className="font-semibold text-[18px]">
              {currentProduct.title || data?.title || params?.title}
            </span>
            <div className="mt-2">
              <Breadcrumbs
                title={currentProduct.title || data?.title || params?.title}
                category={category}
              ></Breadcrumbs>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "bg-white m-auto mt-4 flex",
          isQuickView
            ? "max-w-[950px] rounded-lg  gap-16 p-4 max-h-[80vh] overflow-y-auto"
            : "w-main"
        )}
      >
        <div
          className={clsx(
            " flex flex-col gap-2 ",
            isQuickView ? "w-1/2" : "w-2/5"
          )}
        >
          <div className="h-[458px] w-[458px] object-cover flex items-center justify-center border shadow-md">
            {/* <div className="h-[458px] w-[458px] overflow-hidden border"> */}
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "err",
                  isFluidWidth: true,
                  src: currentImage
                    ? currentImage
                    : "data:image/png;base64,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",
                },
                largeImage: {
                  src: currentImage
                    ? currentImage
                    : "data:image/png;base64,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",
                  width: 1800,
                  height: 1500,
                },
              }}
            />
          </div>
          <div className="w-[458px] shadow-md rounded-lg border pt-[8px] pb-[1px] bg-gray-100">
            <Slider className="image-slider" {...settings}>
              {currentProduct?.images?.length === 0 &&
                product?.images?.map((e, index) => (
                  <div className="flex w-full" key={index}>
                    <img
                      src={e}
                      alt="err"
                      className="h-[152.67px] w-[152.67px] object-cover border cursor-pointer"
                      onClick={(el) => handleClickImage(el, e)}
                    ></img>
                  </div>
                ))}

              {currentProduct?.images?.length > 0 &&
                currentProduct?.images?.map((e, index) => (
                  <div className="flex w-full gap-2" key={index}>
                    <img
                      src={e}
                      alt="err"
                      className="h-[143px] w-[143px] object-cover border cursor-pointer "
                      onClick={(el) => handleClickImage(el, e)}
                    ></img>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <div className={clsx("flex", isQuickView ? "w-1/2" : "w-3/5")}>
          <div
            className={clsx(
              " flex flex-col gap-4 pr-[24px]",
              isQuickView ? "w-full" : "w-3/5"
            )}
          >
            <div className="flex items-end justify-start gap-4">
              <span className="text-[30px] text-main font-semibold">{`${formatMoney(
                currentProduct?.price || product?.price
              )} vnd`}</span>
              <h3 className="font-semibold pb-[6.1px] text-base text-gray-500 line-through">{`${formatMoney(
                Math.ceil(
                  ((currentProduct?.price || product?.price) /
                    (100 - product?.discount)) *
                    100
                )
              )} vnd`}</h3>
              {/* <span className="text-xs text-main ">{`(Warehouse: ${product?.quantity})`}</span> */}
            </div>
            <div className="flex items-center">
              {renderStarFromNumber(product?.totalRating)?.map((e, index) => (
                <span key={index}>{e}</span>
              ))}
              <span className="text-xs text-main pl-2">{`( ${
                product?.ratings?.length
              } reviews / ${
                currentProduct?.sold === 0
                  ? 0
                  : currentProduct?.sold === 1
                  ? 1
                  : currentProduct?.sold > 1
                  ? currentProduct?.sold
                  : "" || product.sold
              } sales )`}</span>
            </div>
            <div className=" py-2 px-4 border shadow-md rounded-lg flex flex-col">
              <span className="text-main font-semibold mb-2">
                Outstanding Features
              </span>
              <ul className=" list-square text-sm text-gray-500 pl-4">
                {product?.description?.length > 1 &&
                  product?.description?.map((e, index) => (
                    <li className=" leading-6" key={index}>
                      {e}
                    </li>
                  ))}

                {product?.description?.length === 1 && (
                  <li
                    className="leading-6 line-clamp-[15]"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(product?.description[0]),
                    }}
                  ></li>
                )}
              </ul>
            </div>
            <div className="my-2 flex gap-4 justify-center items-center">
              <span className="font-semibold">Color:</span>
              <div className="flex flex-wrap gap-4 items-center w-full">
                <div
                  onClick={() => {
                    setVarriant(null);
                    setQuantity(1);
                  }}
                  className={clsx(
                    `flex items-center gap-2 p-2 border cursor-pointer shadow-md rounded-lg`,
                    !varriant && "border-red-500"
                  )}
                >
                  <img
                    src={product?.thumb}
                    alt="thumb"
                    className="w-8 h-8 rounded-md object-cover"
                  ></img>
                  <span className="flex flex-col">
                    <span className="flex gap-3 items-center text-sm justify-start">
                      <span>
                        {product?.color?.slice(0, 1).toUpperCase() +
                          product?.color?.slice(1)}
                      </span>
                      <span
                        className={`w-3 h-3 ${getColorClass(
                          product?.color
                        )} rounded-lg border shadow-sm`}
                      ></span>
                    </span>
                    <span className="text-sm text-main font-semibold">
                      {formatMoney(product?.price)} vnd
                    </span>
                  </span>
                </div>
                {product?.varriants?.map((e, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setVarriant(e?.sku);
                      setQuantity(1);
                    }}
                    className={clsx(
                      `flex items-center gap-2 p-2 border cursor-pointer shadow-md rounded-lg`,
                      varriant === e?.sku && "border-red-500"
                    )}
                  >
                    <img
                      src={e?.thumb}
                      alt="thumb"
                      className="w-8 h-8 rounded-md object-cover"
                    ></img>
                    <span className="flex flex-col">
                      <span className="flex gap-3 text-sm items-center justify-start">
                        <span>
                          {e?.color?.slice(0, 1).toUpperCase() +
                            e?.color?.slice(1)}
                        </span>
                        <span
                          className={`w-3 h-3 ${getColorClass(
                            e?.color
                          )} border rounded-lg shadow-sm`}
                        ></span>
                      </span>
                      <span className="text-sm text-main font-semibold">
                        {formatMoney(e?.price)} vnd
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <span className=" shadow-md border">
                  <SelectQuantity
                    quantity={quantity}
                    handleQuantity={handleQuantity}
                    handleChangeQuantity={handleChangeQuantity}
                  ></SelectQuantity>
                </span>
                <span className="text-xs text-main ">
                  {`(Warehouse: ${
                    currentProduct?.quantity === 0
                      ? 0
                      : currentProduct?.quantity === 1
                      ? 1
                      : currentProduct?.quantity > 1
                      ? currentProduct?.quantity
                      : "" || product?.quantity
                  })`}
                </span>
              </div>
              <div>
                {currentProduct?.quantity === 0 || product?.quantity === 0 ? (
                  <Button
                    type="text"
                    handleOnClick={handleOutStock}
                    style={`px-4 py-2 my-2 rounded-md shadow-md text-white bg-gray-600 text-seminold w-full`}
                  >
                    The product is out of stock
                  </Button>
                ) : (
                  <div>
                    {currentCart?.find(
                      (e) =>
                        (e.product?._id === pid &&
                          e.color === currentProduct?.color) ||
                        (e.product?._id === pid &&
                          e.color === product?.color &&
                          currentProduct?.color === "")
                    ) ? (
                      <Button
                        type="text"
                        handleOnClick={handleShowCart}
                        style={`px-4 py-2 my-2 rounded-md shadow-md text-white bg-gray-600 text-seminold w-full`}
                      >
                        Added to cart
                      </Button>
                    ) : (
                      <Button handleOnClick={handleAddtoCart} fw>
                        Add to cart
                      </Button>
                    )}
                  </div>
                )}
                <span className="text-main flex justify-center items-center text-xs">
                  Fast delivery from two hours for pick up from the store.
                </span>
              </div>
              {/* <Button handleOnClick={handleAddtoCart} fw>
              Add to cart
            </Button> */}
            </div>
          </div>
          {!isQuickView && (
            <div className=" w-2/5 flex flex-col gap-3">
              <div>
                {productExtrainfoData.map((e) => (
                  <ProductExtrainfo
                    key={e.id}
                    title={e.title}
                    icon={e.icon}
                    sub={e.sub}
                  ></ProductExtrainfo>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <div className="pl-1 text-sm">
                  Available at
                  <span className="font-bold text-base text-main ">
                    {" "}
                    20
                  </span>{" "}
                  stores.
                </div>

                <div
                  id="custom-scrollbar"
                  className="flex border rounded-lg shadow-md py-1 flex-col max-h-[280px] overflow-y-auto"
                >
                  {addressStore?.map((e, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "flex flex-col py-2 px-2",
                        +index % 2 === 0 ? "bg-gray-100" : ""
                      )}
                    >
                      <span className="text-xs flex gap-2 justify-start items-center text-main font-semibold">
                        <span>
                          <FaPhoneAlt></FaPhoneAlt>
                        </span>
                        <span>{e.phone}</span>
                      </span>
                      <span className="text-xs flex gap-2 justify-start items-start text-blue-500 font-medium">
                        <span className="mt-[1px]">
                          <IoLocation></IoLocation>
                        </span>
                        <span>{e.main_name_place}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isQuickView && (
        <div className="w-main m-auto mt-8 ">
          <ProductInfo
            totalRating={product?.totalRating}
            ratings={product?.ratings}
            nameProduct={product?.title}
            pid={product?._id}
            rerender={rerender}
          ></ProductInfo>
        </div>
      )}
      {!isQuickView && (
        <div>
          <div className="w-main m-auto mt-8">
            <h3 className=" mb-4 text-[20px] font-semibold py-[15px] border-b-2 border-main">
              OTHER CUSTOMERS ALSO BUY:
            </h3>
            <div className="mx-[-10px]">
              <CustomSlider
                products={relatedProducts}
                normal={true}
                slidesToShow={4}
              ></CustomSlider>
            </div>
          </div>
          <div className="h-[50px] w-full"></div>
        </div>
      )}
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default withBase(memo(DetailProduct));

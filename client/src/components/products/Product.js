import React, { memo, useState } from "react";
import { formatMoney } from "../../ultils/helper";
import label from "../../assets/label.png";
import labelTrending from "../../assets/labelTrending.png";
// import discountTrending from "../../assets/discount.png";
import { renderStarFromNumber } from "../../ultils/helper";
import SelectOption from "../search/SelectOption";
import icons from "../../ultils/icons";
import { Link, createSearchParams } from "react-router-dom";
import withBase from "../../hocs/withBase";
import { showCart, showModal } from "../../store/app/appSlice";
import DetailProduct from "../../pages/public/DetailProduct";
import { apiUpdateCart, apiUpdateWishlist } from "../../apis";
import { getCurrent } from "../../store/users/asyncAction";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import path from "../../ultils/path";

const { LiaEyeSolid, BsFillCartPlusFill, FaHeart, BsFillCartCheckFill } = icons;

const Product = ({
  productData,
  isNew,
  normal,
  navigate,
  dispatch,
  location,
  pid,
}) => {
  const [isShowOption, setIsShowOption] = useState(false);
  const { current } = useSelector((state) => state.user);

  const handleShowCart = (e) => {
    e.stopPropagation();
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

  const handleOutStock = (e) => {
    e.stopPropagation();
    Swal.fire("Oops!", "This product is currently out of stock.", "info");
  };

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation();
    if (flag === "CART") {
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
      // console.log(productData);
      const response = await apiUpdateCart({
        pid: productData?._id,
        quantity: 1,
        color: productData?.color,
        price: productData?.price,
        thumbnail: productData?.thumb,
        title: productData?.title,
        discount: productData?.discount,
      });
      if (response.success) {
        toast.success(response.mes);
        dispatch(getCurrent());
      } else {
        toast.error(response.mes);
      }
    }
    if (flag === "WISHLISH") {
      const response = await apiUpdateWishlist(pid);
      if (response) {
        dispatch(getCurrent());
        toast.success(response.mes);
      } else toast.error(response.mes);
    }
    if (flag === "VIEW") {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <DetailProduct
              data={{
                pid: productData?._id,
                category: productData?.category,
                title: productData.title,
              }}
              isQuickView
            ></DetailProduct>
          ),
        })
      );
    }
  };
  return (
    <div
      className="w-full text-base px-[10px] py-[5px]"
      onClick={() =>
        navigate(
          `/${productData?.category?.toLowerCase()}/${productData?._id}/${
            productData?.title
          }`
        )
      }
    >
      <div
        className="w-full border p-[15px] relative flex flex-col items-center shadow-md rounded-lg cursor-pointer hover:shadow-blue-400"
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <span className="font-semibold z-20 top-[50px] p-2 text-sm left-[0px] bg-main shadow-md h-6 flex justify-center items-center rounded-r-full absolute text-white">
          -{productData?.discount}%
        </span>
        {(productData?.quantity === 0 && productData?.varriants.length === 0) ||
        (productData?.quantity === 0 &&
          productData?.varriants.length > 0 &&
          productData?.varriants.filter((e) => e.quantity > 0).length === 0) ? (
          <span className="font-semibold z-20 top-[80px] p-2 text-sm left-[0px] bg-black shadow-md  h-6 flex justify-center items-center rounded-r-full absolute text-white">
            Out of stock
          </span>
        ) : (
          <span className="font-semibold z-20 top-[80px] p-2 text-sm left-[0px] bg-main shadow-md  h-6 flex justify-center items-center rounded-r-full absolute text-white">
            Stocking
          </span>
        )}
        <div className="w-full relative flex justify-center items-center">
          {isShowOption && (
            <div className="absolute gap-2 bottom-[-10px] left-0 right-0 flex justify-center animate-silde-top">
              <span
                title="Add to wishlist"
                onClick={(e) => handleClickOptions(e, "WISHLISH")}
              >
                <SelectOption
                  icon={
                    <FaHeart
                      color={
                        current?.wishlist?.some((i) => i._id === pid) && "red"
                      }
                    />
                  }
                ></SelectOption>
              </span>
              {(productData?.quantity === 0 &&
                productData?.varriants.length === 0) ||
              (productData?.quantity === 0 &&
                productData?.varriants.length > 0 &&
                productData?.varriants.filter((e) => e.quantity > 0).length ===
                  0) ? (
                <span
                  title="The product is out of stock"
                  // onClick={(e) => e.stopPropagation()}
                  onClick={(e) => handleOutStock(e)}
                >
                  <SelectOption
                    icon={<BsFillCartPlusFill color="gray" />}
                  ></SelectOption>
                </span>
              ) : (
                <div>
                  {current?.cart?.some(
                    (e) => e?.product?._id === productData?._id
                  ) ? (
                    <span
                      title="Added to cart"
                      // onClick={(e) => e.stopPropagation()}
                      onClick={(e) => handleShowCart(e)}
                    >
                      <SelectOption
                        icon={<BsFillCartCheckFill color="red" />}
                      ></SelectOption>
                    </span>
                  ) : (
                    <span
                      title="Add to cart"
                      onClick={(e) => handleClickOptions(e, "CART")}
                    >
                      <SelectOption
                        icon={<BsFillCartPlusFill />}
                      ></SelectOption>
                    </span>
                  )}
                </div>
              )}
              <span
                title="Quick view"
                onClick={(e) => handleClickOptions(e, "VIEW")}
              >
                <SelectOption icon={<LiaEyeSolid />}></SelectOption>
              </span>
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "data:image/png;base64,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"
            }
            alt=""
            className="w-[274px] object-cover h-[274px]"
          ></img>
          {!normal && (
            <div>
              {isNew === true ? (
                <>
                  <img
                    src={label}
                    alt=""
                    className="absolute top-[-16px] right-[-16px] w-[90px] h-[80px] object-cover"
                  ></img>
                  <span className="font-bold top-[10px] right-[8px] absolute text-white origin-bottom -rotate-12">
                    NEW
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={labelTrending}
                    alt=""
                    className="absolute top-[-33.5px] left-[-15px] w-[140px] h-[80px] object-cover"
                  ></img>
                  <span className="font-bold flex z-20 top-[-5px] left-[33px] absolute text-white ">
                    TRENDING
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col mt-[15px] items-start gap gap-1 w-full">
          <span className="line-clamp-1 font-semibold text-sm">
            {productData?.title}
          </span>
          <div className="flex gap-2 justify-start items-center">
            <span className="font-semibold text-base text-main">{`${formatMoney(
              Math.ceil(productData?.price)
            )} vnd`}</span>
            <span className="font-medium text-sm text-gray-500 line-through">{`${formatMoney(
              Math.ceil(
                (productData?.price / (100 - productData?.discount)) * 100
              )
            )} vnd`}</span>
          </div>
          <div className="flex w-full pr-2 justify-between items-center">
            <span className="flex">
              {renderStarFromNumber(productData?.totalRating).map(
                (e, index) => (
                  <span key={index}>{e}</span>
                )
              )}
            </span>
            <span className="text-xs text-main">
              ( sold {productData?.sold} )
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(Product));

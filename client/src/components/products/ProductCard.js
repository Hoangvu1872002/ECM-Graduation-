import React, { memo } from "react";
import { formatMoney, renderStarFromNumber } from "../../ultils/helper";
import withBase from "../../hocs/withBase";
import clsx from "clsx";

const ProductCard = ({ e, navigate }) => {
  return (
    <div
      onClick={() =>
        navigate(`/${e?.category?.toLowerCase()}/${e?._id}/${e?.title}`)
      }
      className="w-1/3 flex-auto flex px-[10px] mb-[20px]"
    >
      <div className=" flex items-center w-full border shadow-md rounded-lg hover:shadow-blue-400 cursor-pointer relative">
        <img
          src={e.thumb}
          alt="product"
          className="w-[120px] object-contain p-4"
        ></img>
        <div className="flex flex-col items-start gap-1 w-full text-sm">
          <div className="flex w-full gap-2 items-center">
            <span className="flex">
              {renderStarFromNumber(e?.totalRating, 14).map((e, index) => (
                <span key={index}>{e}</span>
              ))}
            </span>
            <span className="text-xs font-medium text-main">
              / {e?.sold} sales
            </span>
          </div>
          <span className="line-clamp-1 text-sm font-medium">
            {e?.title.charAt(0) + e?.title.slice(1).toLowerCase()}
          </span>
          {/* <span className="flex h-4">
            {renderStarFromNumber(e.totalRating, 14).map((e, index) => (
              <span key={index}>{e}</span>
            ))}
          </span> */}

          <div className="flex gap-2 justify-start items-center">
            <span className="font-semibold text-sm text-main">{`${formatMoney(
              Math.ceil(e?.price)
            )} vnd`}</span>
            <span className="font-medium text-xs text-gray-500 line-through">{`${formatMoney(
              Math.ceil((e?.price / (100 - e?.discount)) * 100)
            )} vnd`}</span>
          </div>
        </div>
        <div
          className={clsx(
            " rounded-tr-lg rounded-bl-lg text-white p-1 font-medium text-xs absolute top-0 right-0",
            e.quantity === 0 ? "bg-black" : "bg-main"
          )}
        >
          <span className="text-white font-semibold">{e?.quantity} </span>
          products left
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(ProductCard));

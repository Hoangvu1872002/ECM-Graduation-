import React, { memo } from "react";
import avatar from "../../assets/avatarDefault.png";
import moment from "moment";
import { renderStarFromNumber } from "../../ultils/helper";
const Comment = ({
  image = avatar,
  name = "Anonymus",
  updateAt,
  comment,
  star,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-none">
        <img
          src={image}
          alt="avatar"
          className="w-[30px] h-[30px] object-cover rounded-full border"
        ></img>
      </div>
      <div className="flex flex-col flex-auto ">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{name}</h3>
          <span className="text-xs italic">{moment(updateAt)?.fromNow()}</span>
        </div>
        <div className="flex flex-col gap-2 pl-4 text-sm mt-4 border shadow-md rounded-lg border-gray-300 py-2 bg-gray-100">
          <span className="flex items-center gap-1">
            <span className="font-semibold">Evaluate:</span>
            <span className="flex items-center gap-1">
              {renderStarFromNumber(star)?.map((e, index) => (
                <span key={index}>{e}</span>
              ))}
            </span>
          </span>
          <span className="flex gap-1">
            <span className="font-semibold">Comment:</span>
            <span className="flex items-center gap-1">{comment}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);

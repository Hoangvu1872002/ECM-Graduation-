import DOMPurify from "dompurify";
import moment from "moment";
import React, { memo } from "react";
import withBase from "../../hocs/withBase";
import path from "../../ultils/path";
import icons from "../../ultils/icons";

const BlogItem = ({ blogData, navigate }) => {
  const { BiSolidDislike, BiSolidLike } = icons;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div
        className="w-[395px]"
        onClick={() => navigate(`/${path.BLOGS}/${blogData?._id}`)}
      >
        <img src={blogData?.thumb} alt="imageBlog" />
      </div>
      <div
        onClick={() => navigate(`/${path.BLOGS}/${blogData?._id}`)}
        className="w-[380px] mt-4 flex items-center text-center justify-center text-base font-semibold hover:text-red-500 cursor-pointer"
      >
        {blogData?.title.toUpperCase()}
      </div>
      <div className="flex gap-4 items-center justify-center text-xs mt-2 text-gray-400">
        <span className="flex items-center justify-center gap-2">
          <span className="flex items-center justify-center gap-1">
            <span>{blogData?.likes.length}</span>
            <BiSolidLike></BiSolidLike>
          </span>
          <span className="flex items-center justify-center gap-1">
            <span>{blogData?.dislikes.length}</span>{" "}
            <BiSolidDislike></BiSolidDislike>
          </span>
        </span>
        <span>{moment(blogData?.createdAt).format("DD/MM/YYYY")}</span>
      </div>
      <div className=" w-[395px] mt-2 text-center text-sm line-clamp-[3]">
        <div
          className="text-gray-700 text-sm mb-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blogData?.description),
          }}
        ></div>
      </div>
    </div>
  );
};

export default withBase(memo(BlogItem));

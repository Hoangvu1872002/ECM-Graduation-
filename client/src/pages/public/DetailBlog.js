import React, { memo, useEffect, useRef, useState } from "react";
import withBase from "../../hocs/withBase";
import { useParams } from "react-router-dom";
import { Breadcrumbs, Button } from "../../components";
import { apiDislikeBlog, apiGetOneBlog, apiLikeBlog } from "../../apis";
import moment from "moment";
import DOMPurify from "dompurify";
import icons from "../../ultils/icons";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";

const DetailBlog = () => {
  const titleRef = useRef();

  const { bid } = useParams();

  const [dataBlog, setDataBlog] = useState();

  // const dataBlog = dataFakeBlogs.find(
  //   (e) => e.title === title.replace(/-/g, " ")
  // );

  const { BiSolidDislike, BiSolidLike, VscDebugBreakpointDataUnverified } =
    icons;

  const { current } = useSelector((state) => state.user);
  console.log(current);

  const fetchBlogs = async () => {
    const response = await apiGetOneBlog(bid);
    if (response.success) {
      setDataBlog(response.blog);
    }
  };

  const handleLike = async () => {
    const response = await apiLikeBlog(bid);
    if (response.success) {
      toast.success(response.mes);
      fetchBlogs();
    } else {
      toast.error(response.mes);
    }
  };

  const handleDislike = async () => {
    const response = await apiDislikeBlog(bid);
    if (response.success) {
      toast.success(response.mes);
      fetchBlogs();
    } else {
      toast.error(response.mes);
    }
  };

  useEffect(() => {
    titleRef.current.scrollIntoView({ block: "start" });
    fetchBlogs();
  }, []);

  return (
    <div className="w-full">
      <div
        className="h-[81px] mt-4 flex justify-center items-center bg-gray-50"
        ref={titleRef}
      >
        <div className="w-main">
          <span className="font-semibold text-[18px] uppercase">
            {dataBlog?.title}
          </span>
          <div className="mt-2">
            <Breadcrumbs
              // category={blogs.slice(1)}
              title={dataBlog?.title}
            ></Breadcrumbs>
          </div>
        </div>
      </div>
      <div className="my-4 w-main mx-auto flex flex-col gap-4">
        <div className="flex gap-4 items-center text-sm  text-gray-500">
          <VscDebugBreakpointDataUnverified></VscDebugBreakpointDataUnverified>
          <span className="flex items-center justify-center gap-2">
            <span className="flex items-center justify-center gap-1">
              <span>{dataBlog?.likes.length}</span>
              Likes
            </span>
            <span className="flex items-center justify-center gap-1">
              <span>{dataBlog?.dislikes.length}</span> Dislikes
            </span>
          </span>
          <span className="flex items-center justify-center gap-1">
            <span>{dataBlog?.numberViews}</span> Views
          </span>
          <span>{moment(dataBlog?.createdAt).format("DD/MM/YYYY")}</span>
        </div>
        <div className="w-full">
          <img className="w-full" src={dataBlog?.thumb} alt="image"></img>
        </div>

        <div
          className="text-gray-700 text-sm mb-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(dataBlog?.description),
          }}
        ></div>

        <div className="flex justify-end my-4 gap-1">
          <Button
            style={
              "px-4 py-2 my-2 rounded-md shadow-md text-white bg-red-600 hover:bg-red-700 text-semibold flex gap-2  items-center justify-center font-medium"
            }
            handleOnClick={handleLike}
          >
            {dataBlog?.likes.find((e) => e === current._id) ? (
              <>
                <BiSolidLike color="rgb(56 189 248)" size={20}></BiSolidLike>
                <span>Remove Like</span>
              </>
            ) : (
              <>
                <BiSolidLike color="white" size={20}></BiSolidLike>
                <span>Like</span>
              </>
            )}
          </Button>
          <Button
            style={
              "px-4 py-2 my-2 rounded-md shadow-md text-white bg-gray-600 hover:bg-gray-800 text-semibold flex gap-2  items-center justify-center font-medium"
            }
            handleOnClick={handleDislike}
          >
            {dataBlog?.dislikes.find((e) => e === current._id) ? (
              <>
                <BiSolidDislike
                  color="rgb(56 189 248)"
                  size={20}
                ></BiSolidDislike>
                <span>Remove Dislike</span>
              </>
            ) : (
              <>
                <BiSolidDislike color="white" size={20}></BiSolidDislike>
                <span>Dislike</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default withBase(memo(DetailBlog));

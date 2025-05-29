import React, { memo, useEffect, useRef, useState } from "react";
import { Breadcrumbs, Pagination } from "../../components";
import { useParams, useSearchParams } from "react-router-dom";
import { dataFakeBlogs, limit } from "../../ultils/contants";
import withBase from "../../hocs/withBase";
import path from "../../ultils/path";
import { apiGetBlogs } from "../../apis";
import moment from "moment";
import DOMPurify from "dompurify";

const Blog = ({ navigate }) => {
  const titleRef = useRef();
  // const { blogs } = useParams();
  const [params] = useSearchParams();

  //   const titleRef = useRef();

  //   useEffect(() => {
  //     titleRef.current.scrollIntoView({ block: "start" });
  // },[])

  const [count, setCout] = useState(0);
  const [dataBlogs, setDataBlogs] = useState();

  const fetchBlogs = async (params) => {
    const response = await apiGetBlogs({ ...params, limit });
    if (response.success) {
      setCout(response.blogs.length);
      setDataBlogs(response.blogs);
    }
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchBlogs(searchParams);
  }, [params]);

  useEffect(() => {
    titleRef.current.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div className="w-full">
      <div
        ref={titleRef}
        className="h-[81px] mt-4 flex justify-center items-center bg-gray-50"
      >
        <div className="w-main">
          <span className="font-semibold text-[18px] uppercase">Blog</span>
          <div className="mt-2">
            <Breadcrumbs category={"Blog"}></Breadcrumbs>
          </div>
        </div>
      </div>
      <div className="w-main mx-auto mt-4 flex mb-[60px] gap-8">
        <div className="w-[78%] flex flex-col gap-10">
          {dataBlogs?.map((e) => (
            <div key={e.id} className="flex gap-5">
              <div className="flex-1">
                <img src={e.thumb} alt="image" />
              </div>
              <div className="flex-1 flex flex-col mt-[-5px] gap-2">
                <div
                  className="text-lg font-semibold hover:text-red-500 cursor-pointer"
                  onClick={() => navigate(`/${path.BLOGS}/${e?._id}`)}
                >
                  {e.title.toUpperCase()}
                </div>
                <li className="text-xs text-gray-400 ">
                  {moment(e.createAt).format("DD/MM/YYYY")}
                </li>
                <div className="text-sm line-clamp-[9]">
                  <div
                    className="text-gray-700 text-sm mb-4"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(e?.description),
                    }}
                  ></div>
                </div>
                <div
                  className=" text-sm text-red-500 hover:font-semibold cursor-pointer"
                  onClick={() => navigate(`/${path.BLOGS}/${e?._id}`)}
                >
                  Read More
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-[22%] flex flex-col">
          <div className="border max-h-[60%] rounded-md shadow-md">
            <div className="p-2 rounded-t-md pl-4 font-semibold text-lg bg-red-500 text-white">
              RECENT ARTICLES
            </div>
            <div
              id="custom-scrollbar"
              className="flex flex-col gap-4 my-4 ml-4  overflow-y-auto"
            >
              {dataBlogs?.map((e) => (
                <div key={e.id} className="flex flex-col">
                  <span
                    className="font-medium text-sm hover:text-red-500 cursor-pointer"
                    onClick={() => navigate(`/${path.BLOGS}/${e?._id}`)}
                  >
                    {e.title}
                  </span>
                  <li className="text-xs mt-2 text-gray-400 pl-1">
                    {moment(e.createAt).format("DD/MM/YYYY")}
                  </li>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <img
              src="https://digital-world-2.myshopify.com/cdn/shop/files/9069783_orig_400x_5a30224e-9dc2-442a-85fd-0b09a896a89a_400x.jpg?v=1613168570"
              alt="err"
            ></img>
          </div>
          <div className=""></div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-main flex justify-end mb-10">
          <Pagination totalCount={count}></Pagination>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(Blog));

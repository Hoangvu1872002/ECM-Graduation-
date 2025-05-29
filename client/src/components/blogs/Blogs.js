import React, { memo, useEffect, useState } from "react";
import { apiGetBlogs } from "../../apis";
import { limit } from "../../ultils/contants";
import Slider from "react-slick";
import BlogItem from "./BlogItem";

const Blogs = () => {
  const [blogs, setBlogs] = useState();

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToScroll: 1,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const fetchBlogs = async () => {
    const response = await apiGetBlogs({ limit });
    if (response.success) {
      setBlogs(response.blogs);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="mt-6 mx-[-8px]">
      {blogs && (
        <Slider className="custom-slider" {...settings}>
          {blogs?.map((e) => (
            <div key={e._id} className="flex items-center justify-center w-full">
              <BlogItem key={e._id} blogData={e}></BlogItem>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default memo(Blogs);

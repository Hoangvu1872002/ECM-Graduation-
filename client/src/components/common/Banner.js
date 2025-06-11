import React, { memo } from "react";
import Slider from "react-slick";

const Banner = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  return (
    <div className="w-full flex gap-2 ">
      <div className="w-[77.75%] flex flex-col">
        <div>
          <Slider {...settings}>
            <div className="">
              <img
                src="https://png.pngtree.com/thumb_back/fw800/background/20231002/pngtree-d-render-of-an-online-ecommerce-shopping-interface-exploring-the-world-image_13572262.png"
                alt="banner"
                className=" h-[381.8px] w-full object-cover "
              />
            </div>
            <div>
              <img
                src="https://png.pngtree.com/background/20231016/original/pngtree-d-render-illustration-ecommerce-web-banner-featuring-a-smartphone-gift-boxes-picture-image_5581525.jpg"
                alt="banner"
                className=" h-[381.8px] w-full object-cover "
              />
            </div>
            <div>
              <img
                src="https://png.pngtree.com/background/20231016/original/pngtree-d-render-illustration-of-ecommerce-web-banner-featuring-a-smartphone-gift-picture-image_5581855.jpg"
                alt="banner"
                className=" h-[381.8px] w-full object-cover "
              />
            </div>
            <div>
              <img
                src="https://png.pngtree.com/background/20230618/original/pngtree-online-shopping-in-ivory-coast-a-stunning-3d-rendering-for-social-picture-image_3748383.jpg"
                alt="banner2"
                className=" h-[381.8px] w-full object-cover "
              />
            </div>
            {/* <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/deal-km-b2s-2025.jpg"
                alt="banner1"
                className=" h-[381.8px] w-full object-cover "
              />
            </div> */}
          </Slider>
        </div>
        <div className="shadow-md rounded-lg">
          <img
            src="https://cf.shopee.vn/file/sg-11134252-7rd4p-luhcokvjgryn00"
            alt="banner"
            className=" w-full object-cover shadow-md rounded-b-lg  "
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span>
          <img
            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/SIS%20asus.png"
            alt="banner"
            className=" w-full object-cover shadow-md rounded-lg "
          />
        </span>
        <span>
          <img
            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/mac-home.png"
            alt="banner"
            className=" w-full object-cover shadow-md rounded-lg "
          />
        </span>
        <span>
          <img
            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/gian-hang-samsung-home.png"
            alt="banner"
            className=" w-full object-cover shadow-md rounded-lg "
          />
        </span>
        <span>
          <img
            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/xiaomi.png"
            alt="banner"
            className=" w-full object-cover shadow-md rounded-lg "
          />
        </span>
        <span>
          <img
            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/hsbc-home.jpg"
            alt="banner"
            className=" w-full object-cover shadow-md rounded-lg "
          />
        </span>
      </div>
    </div>
  );
};

export default memo(Banner);

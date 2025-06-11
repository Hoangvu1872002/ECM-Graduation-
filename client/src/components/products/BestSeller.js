import React, { memo, useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/product";
import CustomSlider from "../common/CustomSlider";
import { getNewProducts } from "../../store/products/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "BEST SELLERS" },
  { id: 2, name: "NEW ARRIVALS" },
  // { id: 3, name: "tablet" },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
};

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState();
  // const [newProducts, setNewProducts] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [products, setProducts] = useState();
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.products);
  // console.log(newProducts)
  const fetchProducts = async () => {
    const response = await apiGetProducts({ sort: "-sold" });
    // await Promise.all([
    //   apiGetProducts({ sort: "-sold" }),
    //   apiGetProducts({ sort: "-createAt" }),
    // ]);
    if (response?.success) {
      setBestSellers(response.products);
      setProducts(response.products);
    }
    // if (response[1]?.success) setNewProducts(response[1].products);
  };

  useEffect(() => {
    fetchProducts();
    dispatch(getNewProducts());
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      setProducts(bestSellers);
    }
    if (activeTab === 2) {
      setProducts(newProducts);
    }
  }, [activeTab]);
  return (
    <div className="">
      <div className="flex text-[20px] ml-[-32px] ">
        {tabs.map((e) => (
          <span
            key={e.id}
            className={`font-semibold px-8 border-r cursor-pointer ${
              activeTab === e.id ? "text-black" : "text-gray-400"
            }`}
            onClick={() => setActiveTab(e.id)}
          >
            {e.name}
          </span>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t-2 border-main">
        <div className="mx-[-10px]">
          <CustomSlider
            products={products}
            activeTab={activeTab}
            slidesToShow={3}
          ></CustomSlider>
        </div>
      </div>
      <div className="w-full flex gap-3 mt-3  ">
        {/* <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt="banner"
          className="flex-1 object-contain"
        ></img>
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt=""
          className="flex-1 object-contain"
        ></img> */}
        <div className="max-w-[49.32%] border px-2 pt-2 pb-[2px] bg-gray-100 shadow-md rounded-lg">
          <Slider {...settings}>
            {/* <div className="">
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/may-tinh-bang-lenovo-idea-tab-pro-kem-but-ban-phim-cate.png"
                alt="banner1"
                className="object-cover"
              />
            </div> */}
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/may-tinh-bang-teclast-m50-plus-smem.jpg"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/may-tinh-bang-xiaomi-pad-7-pro-smem.jpg"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/pad-se-tet-gia-moi.png"
                alt="banner2"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Pad-7-Pro-cate.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
          </Slider>
        </div>
        <div className="max-w-[49.32%] border px-2 pt-2 pb-[2px] bg-gray-100 shadow-md rounded-lg">
          <Slider {...settings}>
            <div className="">
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Pad-7-cate.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/ipad-a16-t6.png"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/may-tinh-bang-xiaomi-pad-7-pro-smem.jpg"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div className="">
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/may-tinh-bang-lenovo-idea-tab-pro-kem-but-ban-phim-cate.png"
                alt="banner1"
                className="object-cover"
              />
            </div>
            {/* <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/may-tinh-bang-teclast-m50-plus-smem.jpg"
                alt="banner"
                className="object-cover"
              />
            </div> */}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default memo(BestSeller);

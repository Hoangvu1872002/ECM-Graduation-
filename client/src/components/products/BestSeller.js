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
            <div className="">
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/asus%20cate.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Laptop%20MSI%20Modern_cate%20(1).jpg"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Asus_cate.2.jpg"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/acer%20spin.jpg"
                alt="banner2"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/matebook%20d15.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/loq%20cate.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/yoga%20duet.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/tuf%20f15.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/officee.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/intelcoreultra.png"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/intel%20gen%2013.png"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/intel%20evo.png"
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
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/nokia-t21-cate-th4.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/ipad-gen10-cate-thang14.png"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/ipad-pro-cate-th4.jpg"
                alt="banner"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/may-tinh-bang-masstel-tab-10-1-pro-cate.jpg"
                alt="banner2"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/mi-pad6-series-cate-th4.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Galaxy-Tab-S9-Ultra.png"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/redmi-pad-se.png"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Galaxy-Tab-S9-FE-5g-6gb-128gb.png"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Galaxy-Tab-S9-FE-Plus-WIFI-12GB-256GB.png"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/ipad-air-m1-cate-th4.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/lenovo-m11-cate-th4-ban2.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
            <div>
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/lenovo-m8-cate-th4.jpg"
                alt="banner1"
                className="object-cover"
              />
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default memo(BestSeller);

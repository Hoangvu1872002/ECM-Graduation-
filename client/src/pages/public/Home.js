import React, { useEffect, useRef } from "react";
import {
  Banner,
  BestSeller,
  DealDaily,
  Sidebar,
  FeaturedProducts,
  CustomSlider,
} from "../../components";
import { useSelector } from "react-redux";
import icons from "../../ultils/icons";
import { ToastContainer } from "react-toastify";
import Blogs from "../../components/blogs/Blogs";

const { IoIosArrowForward } = icons;
const Home = () => {
  // const titleRef = useRef();
  const { newProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.app);
  // const { isLogedIn, current } = useSelector((state) => state.user);

  // useEffect(() => {
  //   titleRef.current.scrollIntoView({ block: "start" });
  // }, []);

  return (
    <>
      <div className="w-main flex mt-6">
        <div className="flex flex-col gap-5 w-[24%] flex-auto ">
          <Sidebar></Sidebar>
          <DealDaily></DealDaily>
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[76%] flex-auto ">
          <Banner></Banner>
          <BestSeller></BestSeller>
        </div>
      </div>
      <div className="mt-8">
        <FeaturedProducts></FeaturedProducts>
      </div>
      <div className="mt-8 w-main ">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          NEW ARRIVALS
        </h3>
        <div className="mt-4 border rounded-lg">
          <CustomSlider products={newProducts} slidesToShow={4}></CustomSlider>
        </div>
        <div className="my-8 w-full ">
          <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
            HOT COLLECTIONS
          </h3>
          <div className="flex flex-wrap gap-5 mt-6 ">
            {categories
              ?.filter((e) => e.brand.length > 0)
              ?.map((e) => (
                <div key={e._id} className="w-[290px] ">
                  <div className="border flex p-4 gap-4 min-h-[270px] shadow-md rounded-lg">
                    <img
                      className="w-[144px] h-[129px] flex-1 object-cover"
                      src={e?.image}
                      alt=""
                    ></img>
                    <div className="flex-1 text-gray-700">
                      <h4 className="font-semibold uppercase">{e.title}</h4>
                      <ul className="text-sm">
                        {e.brand?.map((item, index) => (
                          <span
                            key={index}
                            className="flex gap-1 items-center text-gray-500"
                          >
                            <IoIosArrowForward size={14} />
                            <li>{item}</li>
                          </span>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="my-8 w-full mb-[100px]">
          <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
            POSTS
          </h3>
          <div className="mt-4">
            <Blogs></Blogs>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </>
  );
};

export default Home;

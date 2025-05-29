import React, { memo, useEffect, useState } from "react";
import { apiGetProducts } from "../../apis";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState(null);
  const fetchProducts = async () => {
    const respone = await apiGetProducts({
      limit: 9,
      page: 1,
      sort: "-totalRating",
      // totalRating: 4,
    });
    if (respone.success) setProducts(respone.products);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="w-main">
      <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
        FREATURED PRODUCTS
      </h3>
      <div className="flex flex-wrap mt-5 mx-[-10px]">
        {products?.map((e) => (
          <ProductCard
            e={e}
            // key={e._id}
            // thumb={e.thumb}
            // title={e.title}
            // totalRating={e.totalRating}
            // price={e.price}
          ></ProductCard>
        ))}
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-4">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-2 row-span-2"
        ></img>

        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        ></img>
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-2"
        ></img>
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        ></img>
      </div>
    </div>
  );
};

export default memo(FeaturedProducts);

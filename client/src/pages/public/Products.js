import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Breadcrumbs,
  InputForm,
  InputSelect,
  Pagination,
  Product,
  SearchItem,
} from "../../components";
import { apiGetProducts } from "../../apis";
// import Masonry from "react-masonry-css";
import { sorts, limit } from "../../ultils/contants";
import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import useDebounce from "../../hooks/useDebounce";

// const breakpointColumnsObj = {
//   default: 4,
//   1100: 3,
//   700: 2,
//   500: 1,
// };

const Products = () => {
  const titleRef = useRef();

  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const { category } = useParams();
  const location = useLocation();

  const [products, setProducts] = useState();
  const [activeClick, setActiveClick] = useState();
  const [sort, setSort] = useState();
  const [dataSearch, setDataSearch] = useState();

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const fetchProductsByCategory = async (queries) => {
    const response = await apiGetProducts({ ...queries, limit });
    if (response) setProducts(response);
  };

  let que = useDebounce(watch("q"), 800);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    let priceQuery = {};
    if (dataSearch !== que) {
      queries.page = 1;
      navigate({
        pathname: location.pathname,
        search: createSearchParams(queries).toString(),
      });
      setDataSearch(que);
    }

    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    } else {
      if (queries.from) queries.price = { gte: queries.from };
      if (queries.to) queries.price = { lte: queries.to };
    }
    delete queries.to;
    delete queries.from;
    let qr;
    if (category === ":category") {
      qr = { ...priceQuery, ...queries, ...{ que } };
    } else {
      qr = { ...priceQuery, ...queries, ...{ category }, ...{ que } };
    }
    fetchProductsByCategory(qr);
    // window.scrollTo(0, 0);
    titleRef.current.scrollIntoView({ block: "start" });
  }, [params, que]);

  const changeActiveFitler = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );

  const changeValue = useCallback(
    (value) => {
      setSort(value);
    },
    [sort]
  );

  useEffect(() => {
    if (sort) {
      const queries = Object.fromEntries([...params]);
      queries.sort = sort;
      // queries.page = 1;
      navigate({
        pathname: location.pathname,
        search: createSearchParams(queries).toString(),
      });
    }
    // if (sort) {
    //   navigate({
    //     pathname: `/${category}`,
    //     search: createSearchParams({
    //       sort,
    //     }).toString(),
    //   });
    // }
  }, [sort]);
  return (
    <div className="w-full">
      <div
        ref={titleRef}
        className="h-[81px] mt-4 flex justify-center items-center bg-gray-50"
      >
        <div className="w-main">
          <span className="font-semibold text-[18px] uppercase">
            {category === ":category" ? category.slice(1) : category}
          </span>
          <div className="mt-2">
            <Breadcrumbs
              category={category === ":category" ? category.slice(1) : category}
            ></Breadcrumbs>
          </div>
        </div>
      </div>
      <div className="w-main border p-4 flex justify-start gap-2 mt-4 m-auto shadow-md rounded-lg">
        <div className="w-1/5 flex flex-col gap-3">
          <span className="font-semibold text-sm mt-[-7px]">Filter by</span>
          <div className="flex items-center gap-4">
            <SearchItem
              name="Price"
              activeClick={activeClick}
              changeActiveFitler={changeActiveFitler}
              type="input"
            ></SearchItem>
            <SearchItem
              name="Color"
              activeClick={activeClick}
              changeActiveFitler={changeActiveFitler}
            ></SearchItem>
          </div>
        </div>

        <div className="w-1/5 flex flex-col gap-3">
          <span className="font-semibold text-sm mt-[-7px]">Sort by</span>
          <div className="w-full ">
            <InputSelect
              value={sort}
              changeValue={changeValue}
              options={sorts}
            ></InputSelect>
          </div>
        </div>
        <div className="w-2/5 flex flex-col gap-3">
          <span className="font-semibold text-sm mt-[-7px]">Search</span>
          <form className="w-[70%]">
            {/* <InputForm
              id="q"
              register={register}
              errors={errors}
              fullWith
              placeholder="Search products by title"
            ></InputForm> */}
            <input
              id="q"
              {...register("q")}
              placeholder="Search products by title"
              className={clsx(
                `form-input text-xs border p-3 w-full rounded-md`
              )}
            ></input>
            {errors["q"] && (
              <small className="text-xs text-red-500">
                {errors["q"]?.message}
              </small>
            )}
          </form>
        </div>
      </div>
      <div className="mt-4 w-main m-auto  grid grid-cols-4 gap-4">
        {/* <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex "
          columnClassName="my-masonry-grid_column"
        >
          {products?.products?.map((e) => (
            <Product
              key={e._id}
              pid={e._id}
              productData={e}
              normal={true}
            ></Product>
          ))}
        </Masonry> */}
        {products?.products?.map((e, index) => (
          <div key={index} className="mx-[-10px]">
            <Product
              key={e._id}
              pid={e._id}
              productData={e}
              normal={true}
            ></Product>
          </div>
        ))}
      </div>
      <div className=" w-main m-auto my-4 flex justify-end">
        <Pagination totalCount={products?.counts}></Pagination>
      </div>
      <div className="w-full h-[30px]"></div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default Products;

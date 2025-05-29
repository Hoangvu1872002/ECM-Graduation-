import React, { memo, useEffect, useState } from "react";
import icons from "../../ultils/icons";
import { colors } from "../../ultils/contants";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { apiGetProducts } from "../../apis";
import useDebounce from "../../hooks/useDebounce";

const SearchItem = ({
  name,
  activeClick,
  changeActiveFitler,
  type = "checkbox",
}) => {
  const { IoIosArrowDown } = icons;

  const [selected, setSelected] = useState([]);
  const [bestPrice, setBestPrice] = useState();
  const [price, setPrice] = useState({
    from: "",
    to: "",
  });

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const { category } = useParams();

  const handleSelect = (e) => {
    const alreadyEl = selected?.find((el) => el === e.target.value);
    if (alreadyEl) {
      setSelected((prev) => prev.filter((el) => el !== e.target.value));
    } else setSelected((prev) => [...prev, e.target.value]);
    changeActiveFitler(null);
  };

  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of param) queries[i[0]] = i[1];
    if (selected.length > 0) {
      queries.color = selected.join(",");
      queries.page = 1;
    } else delete queries.color;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [selected]);

  const fetchBestPriceProduct = async () => {
    const response = await apiGetProducts({ sort: "-price", limit: 1 });
    setBestPrice(response?.products[0]?.price);
  };

  useEffect(() => {
    if (type === "input") fetchBestPriceProduct();
  }, [type]);

  useEffect(() => {
    if (price.from && price.to) {
      if (Number(price.from) > Number(price.to))
        alert("From price cannot greater than to price.");
    }
  }, [price]);

  const deboucePriceFrom = useDebounce(price.from, 500);
  const deboucePriceTo = useDebounce(price.to, 500);
  useEffect(() => {
    let param = [];
    for (let i of params.entries()) param.push(i);
    const queries = {};
    for (let i of param) queries[i[0]] = i[1];
    if (Number(price.from) > 0) queries.from = price.from;
    else delete queries.from;
    if (Number(price.to) > 0) queries.to = price.to;
    else delete queries.to;
    queries.page = 1;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [deboucePriceFrom, deboucePriceTo]);

  return (
    <div
      className="relative p-3  cursor-pointer text-gray-500 text-xs gap-4 rounded-md border border-gray-800 flex items-center justify-between"
      onClick={() => changeActiveFitler(name)}
    >
      <span className="capitalize">{name}</span>
      <IoIosArrowDown></IoIosArrowDown>
      {activeClick === name && (
        <div className="absolute flex z-30 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]">
          {type === "checkbox" && (
            <div className="w-[150px]">
              <div className="py-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">
                  <span className="text-main font-semibold text-sm">{`${selected.length} `}</span>
                  Selected.
                </span>
                <span
                  className="underline cursor-pointer hover:text-main"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected([]);
                    changeActiveFitler(null);
                  }}
                >
                  Reset
                </span>
              </div>
              <div
                className="flex flex-col gap-3 mt-4 "
                onClick={(e) => e.stopPropagation()}
              >
                {colors.map((e, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={e}
                      className="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      value={e}
                      id={e}
                      onChange={handleSelect}
                      checked={selected?.some(
                        (selectedItem) => selectedItem === e
                      )}
                    ></input>
                    <label htmlFor={e} className="capitalize text-gray-700">
                      {e}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "input" && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="py-4 items-center flex justify-between gap-8 border-b">
                <span className="whitespace-nowrap">
                  The highest price is{" "}
                  <span className="text-main text-sm font-semibold">{` ${Number(
                    bestPrice
                  ).toLocaleString()}`}</span>{" "}
                  vnd.
                </span>
                <span
                  className="underline cursor-pointer hover:text-main"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrice({ from: "", to: "" });
                    changeActiveFitler(null);
                  }}
                >
                  Reset
                </span>
              </div>
              <div className="flex items-center p-2 gap-2 ">
                <div className="flex items-center gap-2 mr-4 ">
                  <label htmlFor="from">From:</label>
                  <input
                    className="form-input border p-2 rounded-md"
                    type="number"
                    id="from"
                    value={price.from}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, from: e.target.value }))
                    }
                  ></input>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="from">To:</label>
                  <input
                    className="form-input border p-2 rounded-md"
                    type="number"
                    id="from"
                    value={price.to}
                    onChange={(e) =>
                      setPrice((prev) => ({ ...prev, to: e.target.value }))
                    }
                  ></input>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItem);

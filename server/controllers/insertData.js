const productModel = require("../models/product");
const asyncHandler = require("express-async-handler");
const data = require("../data/data.json");
const slugify = require("slugify");
const category = require("../data/cate_brand");
const categoryModel = require("../models/productCategory");

const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "brown",
  "black",
  "white",
  "gray",
];

const fn = async (product) => {
  await productModel.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 10000) + "",
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 100),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    // color: product?.variants?.find((e) => e.label === "Color")?.variants[0] || "RED",
    color: colors[Math.floor(Math.random() * colors.length)],
    discount: Math.round(Math.random() * 36) + 10,
    totalRating: 0,
    thumb: product?.thumb,
  });
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) promises.push(fn(product));
  await Promise.all(promises);
  return res.json("Done");
});

const fn2 = async (cate) => {
  await categoryModel.create({
    title: cate?.cate,
    brand: cate?.brand,
    image: cate?.image,
  });
};

const insertCategory = asyncHandler(async (req, res) => {
  const promises = [];
  for (let cate of category) promises.push(fn2(cate));
  await Promise.all(promises);
  return res.json("Done");
});

module.exports = {
  insertProduct,
  insertCategory,
};

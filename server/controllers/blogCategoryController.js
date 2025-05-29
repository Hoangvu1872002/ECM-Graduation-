const blogCategoryModel = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await blogCategoryModel.create(req.body);
  return res.json({
    success: response ? true : false,
    createCategory: response ? response : " Cannot create new blog category.",
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const response = await blogCategoryModel.find().select("title _id");
  return res.json({
    success: response ? true : false,
    blogCategory: response ? response : " Cannot get blog category.",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await blogCategoryModel.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCategory: response ? response : " Cannot update blog category.",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await blogCategoryModel.findByIdAndDelete(bcid);
  return res.json({
    success: response ? true : false,
    deleteCategory: response ? response : " Cannot delete blog category.",
  });
});

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

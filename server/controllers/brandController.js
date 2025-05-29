const brandModel = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const response = await brandModel.create(req.body);
  return res.json({
    success: response ? true : false,
    createBrand: response ? response : " Cannot create new brand.",
  });
});

const getBrand = asyncHandler(async (req, res) => {
  const response = await brandModel.find();
  return res.json({
    success: response ? true : false,
    brand: response ? response : " Cannot get brand.",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await brandModel.findByIdAndUpdate(bid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateBrand: response ? response : " Cannot update brand.",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await brandModel.findByIdAndDelete(bid);
  return res.json({
    success: response ? true : false,
    deleteBrand: response ? response : " Cannot delete brand.",
  });
});

module.exports = {
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};

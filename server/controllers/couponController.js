const couponModel = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing inputs.");
  const response = await couponModel.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.json({
    success: response ? true : false,
    createdCoupon: response ? response : " Cannot create new counpon.",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const response = await couponModel.find().select("-createAt -updateAt");
  return res.json({
    success: response ? true : false,
    getCoupon: response ? response : " Cannot get counpon.",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length == 0) throw new Error("Missing inputs.");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await couponModel.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateCoupon: response ? response : " Cannot update counpon.",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await couponModel.findOneAndDelete(cid);
  return res.json({
    success: response ? true : false,
    deleteCoupon: response ? response : " Cannot delete counpon.",
  });
});

module.exports = {
  createNewCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};

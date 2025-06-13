const shippingModel = require("../models/bill");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");

const getAdminShippings = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const { status, q } = queries;
  console.log(queries);

  if (q) {
    const isValidId = ObjectId.isValid(q);
    if (isValidId) {
      const response = await shippingModel
        .findById(q)
        .populate("driverId", "firstname lastname mobile")
        .populate("userId", "firstname lastname mobile");
      return res.status(200).json({
        success: response ? true : false,
        counts: 1,
        order: response ? [response] : [],
      });
    } else {
      return res.status(200).json({
        success: false,
        counts: 0,
        order: [],
      });
    }
  } else {
    let qr;
    let queryCommand;
    if (status) {
      qr = { status: status };
      queryCommand = shippingModel
        .find(qr)
        .populate("driverId", "firstname lastname mobile")
        .populate("userId", "firstname lastname mobile");
    } else {
      queryCommand = shippingModel
        .find()
        .populate("driverId", "firstname lastname mobile")
        .populate("userId", "firstname lastname mobile");
    }

    //sorting
    //abc,efg => [abc,efg] => abc efg
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      // console.log(sortBy);
      queryCommand = queryCommand.sort(sortBy);
    }

    //pagination
    //limit: so object lay ve trong 1 l;an goij api
    //skip: bo qua bao nhieu object
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    //execute query
    //so luong san pham thoa man dieu kien !== so luong sp tra ve 1 lan goi api
    queryCommand
      .then(async (response) => {
        const counts = await shippingModel.find(qr).countDocuments();
        return res.status(200).json({
          success: response ? true : false,
          counts,
          order: response ? response : "Cannot get shipping.",
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
});

const getAllBills = asyncHandler(async (req, res) => {
  try {
    const bills = await shippingModel.find();

    return res.status(200).json({
      success: true,
      counts: bills.length,
      bills,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get all bills.",
    });
  }
});

module.exports = {
  getAdminShippings,
  getAllBills,
};

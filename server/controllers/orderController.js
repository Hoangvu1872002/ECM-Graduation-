const orderModel = require("../models/order");
const userModel = require("../models/user");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const productModel = require("../models/product");

const createNewOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    shippingAddress,
    billingAddress,
    coupons,
    message,
    products,
    tax,
    total,
    totalPriceProducts,
    transportFee,
    paymentMethods,
  } = req.body;
  let checkQuantity = false;

  // Kiểm tra và cập nhật số lượng sản phẩm
  for (let product of products) {
    const findProduct = await productModel.findOne({
      _id: new ObjectId(product.product._id),
      color: product.color,
    });

    let findVarriant = null;
    if (!findProduct) {
      findVarriant = await productModel.findOne({
        _id: new ObjectId(product.product._id),
        varriants: { $elemMatch: { color: product.color } },
      });
    }

    if (findProduct) {
      if (findProduct.quantity === 0) {
        await userModel.findByIdAndUpdate(
          _id,
          {
            $pull: {
              cart: { product: product.product._id, color: product.color },
            },
          },
          { new: true }
        );
      } else if (findProduct.quantity >= product.quantity) checkQuantity = true;
    } else if (findVarriant) {
      if (
        findVarriant.varriants.find((e) => e.color === product.color)
          .quantity === 0
      ) {
        await userModel.findByIdAndUpdate(
          _id,
          {
            $pull: {
              cart: { product: product.product._id, color: product.color },
            },
          },
          { new: true }
        );
      } else if (
        findVarriant.varriants.find((e) => e.color === product.color)
          .quantity >= product.quantity
      ) {
        checkQuantity = true;
      }
    }
    if (checkQuantity) {
      const updateQuantityProduct = await productModel.updateOne(
        { _id: new ObjectId(product.product._id), color: product.color },
        { $inc: { quantity: -product.quantity, sold: product.quantity } },
        { new: true }
      );

      if (updateQuantityProduct.modifiedCount === 0) {
        const updateQuantityVarriant = await productModel.updateOne(
          {
            _id: new ObjectId(product.product._id),
            varriants: { $elemMatch: { color: product.color } },
          },
          {
            $inc: {
              "varriants.$.quantity": -product.quantity,
              "varriants.$.sold": product.quantity,
            },
          },
          { new: true }
        );

        if (updateQuantityVarriant.modifiedCount === 0) {
          return res.json({
            success: false,
            rs: "Don't update quantity.",
          });
        }
      }
    }
  }

  if (!checkQuantity) {
    return res.status(401).json({
      success: false,
      notEnough: true,
      mes: `Product quantity is not enough.`,
    });
  }

  // Tạo đơn hàng mới
  const rs = await orderModel.create({
    shippingAddress,
    billingAddress,
    coupons,
    message,
    products,
    tax,
    total,
    totalPriceProducts,
    transportFee,
    paymentMethods,
    orderBy: _id,
  });

  // Xóa giỏ hàng của người dùng sau khi tạo đơn hàng
  const rsp = await userModel.findByIdAndUpdate(
    _id,
    { cart: [] },
    { new: true }
  );

  return res.json({
    success: rsp && rs ? true : false,
    rs: rsp && rs ? rs : "Something went wrong.",
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const { _id } = req.user;
  const { status, q } = queries;
  // console.log(queries);

  if (q) {
    const isValidId = ObjectId.isValid(q);
    if (isValidId) {
      const response = await orderModel
        .find({ _id: q, orderBy: _id })
        .populate("orderBy", "firstname lastname mobile");
      return res.status(200).json({
        success: response ? true : false,
        counts: 1,
        order: response ? response : [],
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
      qr = { status: status, orderBy: _id };
      queryCommand = orderModel
        .find(qr)
        .populate("orderBy", "firstname lastname mobile");
    } else {
      qr = { orderBy: _id };
      queryCommand = orderModel
        .find(qr)
        .populate("orderBy", "firstname lastname mobile")
        .populate({
          path: "products",
          populate: {
            path: "product",
            select: "title _id category",
          },
        });
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
    // console.log(qr);
    queryCommand
      .then(async (response) => {
        const counts = await orderModel.find(qr).countDocuments();
        return res.status(200).json({
          success: response ? true : false,
          counts,
          order: response ? response : "Cannot get products.",
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
});

const getAdminOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const { status, q } = queries;
  // console.log(queries);

  if (q) {
    const isValidId = ObjectId.isValid(q);
    if (isValidId) {
      const response = await orderModel
        .findById(q)
        .populate("orderBy", "firstname lastname mobile");
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
      queryCommand = orderModel
        .find(qr)
        .populate("orderBy", "firstname lastname mobile");
    } else {
      queryCommand = orderModel
        .find()
        .populate("orderBy", "firstname lastname mobile");
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
        const counts = await orderModel.find(qr).countDocuments();
        return res.status(200).json({
          success: response ? true : false,
          counts,
          order: response ? response : "Cannot get products.",
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const response = await orderModel
    .find()
    .select("products status total updatedAt");
  return res.status(200).json({
    success: response ? true : false,
    order: response ? response : "err",
  });
});

module.exports = {
  createNewOrder,
  getUserOrders,
  getAdminOrders,
  getAllOrders,
};

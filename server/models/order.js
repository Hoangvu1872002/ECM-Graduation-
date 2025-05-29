const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        discount: String,
        price: Number,
        thumbnail: String,
        title: String,
      },
    ],
    status: {
      type: String,
      default: "Proccessing",
      enum: [
        "Cancelled",
        "Proccessing",
        "Shipping",
        "Successed",
        "FindDriver",
        "DriverPickup",
      ],
    },
    totalPriceProducts: {
      type: Number,
    },
    transportFee: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    coupons: {
      type: Number,
    },
    total: {
      type: Number,
    },
    message: {
      type: String,
    },
    paymentMethods: {
      type: String,
    },
    shippingAddress: {
      main_name_place: { type: String }, // Địa chỉ giao hàng cụ thể
      description: { type: String }, // Địa chỉ giao hàng mô tả
      latitude: { type: Number }, // Vĩ độ
      longitude: { type: Number }, // Kinh độ
    },
    billingAddress: {
      main_name_place: { type: String }, // Địa chỉ nhận hàng cụ thể
      description: { type: String }, // Địa chỉ nhận hàng mô tả
      latitude: { type: Number }, // Vĩ độ
      longitude: { type: Number }, // Kinh độ
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);

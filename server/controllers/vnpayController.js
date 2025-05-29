const asyncHandler = require("express-async-handler");

const moment = require("moment");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const createVnpayOrder = asyncHandler(async (req, res) => {
  const { total, locale } = req.body;
  // console.log({total, locale});
  process.env.TZ = "Asia/Ho_Chi_Minh";
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // var dateFormat = require("dateformat");

  let tmnCode = "TN44ADZK";
  let secretKey = "BEBLNQOQOJXNTUDOHMIBPAHSXQVHPWHK";
  let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  let returnUrl =
    "https://hoangvux-be-ecommerce.onrender.com/vnpay/vnpay_return";

  var date = new Date();

  var createDate = moment(date).format("YYYYMMDDHHmmss");
  // console.log(createDate);
  const currentTime = moment();

  // Thêm một khoảng thời gian, ví dụ: 30 phút
  const expireTime = currentTime.add(40, "minutes");

  // Định dạng thời gian theo định dạng yêu cầu của VNPAY (yyyyMMddHHmmss)
  const formattedExpireTime = expireTime.format("YYYYMMDDHHmmss");
  var orderId = Math.floor(Math.random() * 1000);
  // var amount = 100000;
  var bankCode = "NCB";

  var orderInfo = "Noi dung thanh toan";
  var orderType = "billpayment";
  // var locale = ""
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_ExpireDate"] = formattedExpireTime;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = Math.ceil(total) * 100;

  // vnp_Params["vnp_Address"] = address;

  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  // console.log(vnpUrl);
  res.json(vnpUrl);
});

const vnpayReturn = asyncHandler(async (req, res) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let tmnCode = "TN44ADZK";
  let secretKey = "BEBLNQOQOJXNTUDOHMIBPAHSXQVHPWHK";

  var querystring = require("qs");
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  const code = Number(vnp_Params.vnp_ResponseCode);
  if (code === 0) {
    res.redirect("https://hoangvux-fe-ecommerce.netlify.app/success");
  } else {
    res.redirect("https://hoangvux-fe-ecommerce.netlify.app");
  }
});

module.exports = {
  createVnpayOrder,
  vnpayReturn,
};

// var tmnCode = "TN44ADZK";
// var secretKey = "BEBLNQOQOJXNTUDOHMIBPAHSXQVHPWHK";
// var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
// var returnUrl = "http://localhost:8888/order/vnpay_return";
// // "vnp_Url":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
// // "vnp_Api":"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
// // "vnp_ReturnUrl": "http://localhost:8888/order/vnpay_return"

// var date = new Date();

// // var createDate = dateFormat(date, "yyyymmddHHmmss");
// // var orderId = dateFormat(date, "HHmmss");
// var createDate = date;
// var orderId = Math.floor(Math.random() * 1000);
// // var amount = req.body.amount;
// var amount = 100000;
// var bankCode = "NCB";

// var orderInfo = "Noi dung thanh toan";
// var orderType = "billpayment";

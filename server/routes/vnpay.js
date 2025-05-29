var express = require("express");
const { createVnpayOrder, vnpayReturn } = require("../controllers/vnpayController");
const { verifyAccessToken } = require("../middlewares/verifyToken");
var router = express.Router();

router.post("/create_payment_url",verifyAccessToken, createVnpayOrder);
router.get("/vnpay_return", vnpayReturn);

module.exports = router;
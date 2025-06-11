var express = require("express");
var router = express.Router();
const {
  createNewOrder,
  getUserOrders,
  getAdminOrders,
  getAllOrders,
} = require("../controllers/orderController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

/* GET users listing. */
router.post("/", verifyAccessToken, createNewOrder);
router.get("/user", verifyAccessToken, getUserOrders);
router.get("/admin", verifyAccessToken, isAdmin, getAdminOrders);
router.get("/dashboard", getAllOrders);

module.exports = router;

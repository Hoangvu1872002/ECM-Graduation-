var express = require("express");
var router = express.Router();
const {
  createNewCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

/* GET users listing. */
router.post("/", verifyAccessToken, isAdmin, createNewCoupon);
router.get("/", getCoupons);
router.put("/:cid", verifyAccessToken, isAdmin, updateCoupon);
router.delete("/:cid", verifyAccessToken, isAdmin, deleteCoupon);

module.exports = router;

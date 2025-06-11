var express = require("express");
var router = express.Router();

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const { getAdminShippings } = require("../controllers/shippingController");

/* GET users listing. */

router.get("/admin", verifyAccessToken, isAdmin, getAdminShippings);

module.exports = router;

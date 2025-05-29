var express = require("express");
var router = express.Router();
const { createBrand, getBrand, updateBrand, deleteBrand } = require("../controllers/brandController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

/* GET users listing. */
router.post("/", verifyAccessToken, isAdmin, createBrand);
router.get("/", getBrand);
router.put("/:bid", verifyAccessToken, isAdmin, updateBrand);
router.delete("/:bid", verifyAccessToken, isAdmin, deleteBrand);

module.exports = router;

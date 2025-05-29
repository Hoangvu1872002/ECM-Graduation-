var express = require("express");
var router = express.Router();
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/productCategoryController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

/* GET users listing. */
router.post("/", verifyAccessToken, isAdmin, createCategory);
router.get("/", getCategory);
router.put("/:pcid", verifyAccessToken, isAdmin, updateCategory);
router.delete("/:pcid", verifyAccessToken, isAdmin, deleteCategory);

module.exports = router;

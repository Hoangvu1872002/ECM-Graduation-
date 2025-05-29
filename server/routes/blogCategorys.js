var express = require("express");
var router = express.Router();
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/blogCategoryController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

/* GET users listing. */
router.post("/", verifyAccessToken, isAdmin, createCategory);
router.get("/", getCategory);
router.put("/:bcid", verifyAccessToken, isAdmin, updateCategory);
router.delete("/:bcid", verifyAccessToken, isAdmin, deleteCategory);

module.exports = router;

var express = require("express");
var router = express.Router();
const {
  createNewBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikeBlog,
  getOneBlog,
  deleteBlog,
  uploadImagesBlog,
} = require("../controllers/blogController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
const uploadImage = require("../config/cloudinary.config");

/* GET users listing. */
router.get("/", getBlogs);
router.get("/one-blog/:bid", getOneBlog);
router.post(
  "/",
  verifyAccessToken,
  isAdmin,
  uploadImage.fields([{ name: "thumb", maxCount: 1 }]),
  createNewBlog
);
router.put("/like/:bid", verifyAccessToken, likeBlog);
router.put(
  "/image/:bid",
  verifyAccessToken,
  isAdmin,
  uploader.single("image"),
  uploadImagesBlog
);
router.put("/dislike/:bid", verifyAccessToken, dislikeBlog);
router.put(
  "/:bid",
  verifyAccessToken,
  isAdmin,
  uploadImage.fields([{ name: "thumb", maxCount: 1 }]),
  updateBlog
);
router.delete("/:bid", verifyAccessToken, isAdmin, deleteBlog);

module.exports = router;

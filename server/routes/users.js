var express = require("express");
var router = express.Router();
const {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  finalRegister,
  createUsers,
  removeProductInCart,
  updateWishlist,
} = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploadImage = require("../config/cloudinary.config");

/* GET users listing. */
router.post("/register", register);
router.post("/mock", createUsers);
router.get("/finalregister/:token", finalRegister);
router.post("/login", login);
router.get("/current", verifyAccessToken, getCurrent);
router.post("/refreshtoken", refreshAccessToken);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.get("/", verifyAccessToken, isAdmin, getUsers);
router.delete("/:uid", verifyAccessToken, isAdmin, deleteUser);
router.put("/wishlist/:pid", verifyAccessToken, updateWishlist);
router.put(
  "/current",
  verifyAccessToken,
  uploadImage.single("avatar"),
  updateUser
);
router.put("/address", verifyAccessToken, updateUserAddress);
router.put("/cart", verifyAccessToken, updateCart);
router.delete("/remove-cart/:pid/:color", verifyAccessToken, removeProductInCart);
router.put("/:uid", verifyAccessToken, isAdmin, updateUserByAdmin);

module.exports = router;

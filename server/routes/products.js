var express = require("express");
var router = express.Router();
const {
  createProduct,
  getProduct,
  getManyProduct,
  updateProduct,
  deleteProduct,
  rating,
  uploadImagesProduct,
  addVarriants,
  deleteVarriants,
  editVarriants,
} = require("../controllers/productController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploadImage = require("../config/cloudinary.config");

/* GET users listing. */
router.post(
  "/",
  verifyAccessToken,
  isAdmin,
  uploadImage.fields([
    { name: "images", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
  ]),
  createProduct
);
router.get("/", getManyProduct);
router.put("/rating", verifyAccessToken, rating);

router.put(
  "/upload-image/:pid",
  verifyAccessToken,
  isAdmin,
  uploadImage.array("images", 10),
  uploadImagesProduct
);
router.post("/varriant/edit/:pid", verifyAccessToken, isAdmin, editVarriants);
router.put(
  "/varriant/:pid",
  verifyAccessToken,
  isAdmin,
  uploadImage.fields([
    { name: "images", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
  ]),
  addVarriants
);
router.put(
  "/:pid",
  verifyAccessToken,
  isAdmin,
  uploadImage.fields([
    { name: "images", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
  ]),
  updateProduct
);
router.delete(
  "/varriant/:pid/:color",
  verifyAccessToken,
  isAdmin,
  deleteVarriants
);
router.delete("/:pid", verifyAccessToken, isAdmin, deleteProduct);
router.get("/:pid", getProduct);

module.exports = router;

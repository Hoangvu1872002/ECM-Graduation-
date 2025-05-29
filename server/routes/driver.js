var express = require("express");
const {
  registerDriver,
  getDrivers,
  deleteDriver,
  updateDriver,
} = require("../controllers/driverController");
var router = express.Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploadImage = require("../config/cloudinary.config");

/* GET Drivers listing. */
router.post(
  "/register",
  verifyAccessToken,
  isAdmin,
  uploadImage.fields([{ name: "avatar", maxCount: 1 }]),
  registerDriver
);

router.get("/", verifyAccessToken, isAdmin, getDrivers);
router.delete("/:did", verifyAccessToken, isAdmin, deleteDriver);
router.put(
  "/:did",
  verifyAccessToken,
  isAdmin,
  uploadImage.fields([{ name: "avatar", maxCount: 1 }]),
  updateDriver
);

module.exports = router;

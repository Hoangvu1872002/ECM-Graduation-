var express = require("express");
var router = express.Router();
const { insertProduct, insertCategory } = require("../controllers/insertData");

/* GET users listing. */

router.post("/", insertProduct);
router.post("/cate", insertCategory);

module.exports = router;

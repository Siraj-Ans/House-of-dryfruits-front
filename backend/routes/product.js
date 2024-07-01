const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/product");

router.get("/fetchNewProducts", productControllers.fetchNewProducts);

module.exports = router;

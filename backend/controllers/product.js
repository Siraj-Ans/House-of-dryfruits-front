const Product = require("../models/product");

exports.fetchNewProducts = (req, res) => {
  async function getNewProdcutsFromDB() {
    try {
      const result = await Product.find({}, null, {
        sort: { _id: -1 },
        limit: 10,
      }).populate("productCategory");

      console.log("result: ", result);
      res.status(200).json({
        message: "Successfully fetched the new products!",
        products: result,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "server failed to fetch the new products!",
      });
    }
  }

  getNewProdcutsFromDB();
};

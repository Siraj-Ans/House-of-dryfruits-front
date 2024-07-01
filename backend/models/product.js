const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: { type: String, required: true },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productImages: { type: [Object], required: true },
    description: { type: String, required: true },
    priceInPKR: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);

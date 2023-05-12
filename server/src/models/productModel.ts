const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    billAvailable: {
      type: Boolean,
      required: true,
    },
    warrantyAvailable: {
      type: Boolean,
      required: true,
    },
    accessoriesAvailable: {
      type: Boolean,
      required: true,
    },
    boxAvailable: {
      type: Boolean,
      required: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

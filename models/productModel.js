const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
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
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },
    image1: {
      data: Buffer,
      contentType: String,
    },
    image2: {
      data: Buffer,
      contentType: String,
    },
    image3: {
      data: Buffer,
      contentType: String,
    },
    image4: {
      data: Buffer,
      contentType: String,
    },
    address: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)

const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v)
        },
        message: "Invalid email address.",
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{11}$/.test(v)
        },
        message: "Mobile number must be exactly 11 digits.",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("users", userSchema)

const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.ObjectId,
      ref: "Chat",
    },
    readBy: [
      {
        type: mongoose.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Message", messageSchema)

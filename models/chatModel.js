const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    users: [
      {
        type: mongoose.ObjectId,
        ref: "users",
      },
    ],
    latestMessage: {
      type: mongoose.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Chat", chatSchema)

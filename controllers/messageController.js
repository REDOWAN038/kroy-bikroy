const messageModel = require("../models/messageModel")
const chatModel = require("../models/chatModel")
const userModel = require("../models/userModel")

const allMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat")
    res.status(200).send({
      success: true,
      messages,
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      error,
    })
  }
}

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body

    if (!content || !chatId) {
      console.log("Invalid data passed into request")
      return res.status(400).send({
        success: false,
        message: "Invalid data passed into request",
      })
    }

    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    }

    let message = await messageModel.create(newMessage)

    message = await message.populate("sender", "name")
    message = await message.populate("chat")
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name email",
    })

    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    })

    res.status(200).send({
      success: true,
      message,
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      error,
    })
  }
}

module.exports = { allMessages, sendMessage }

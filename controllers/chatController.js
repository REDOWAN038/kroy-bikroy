const chatModel = require("../models/chatModel")
const userModel = require("../models/userModel")

const accessChat = async (req, res) => {
  try {
    const { userId, productName } = req.body

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "UserId param not sent with request",
      })
    }

    let isChat = await chatModel
      .find({
        $and: [
          { chatName: productName },
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage")

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    })

    if (isChat.length > 0) {
      res.status(201).send({
        success: true,
        message: "already available",
        chat: isChat[0],
      })
    } else {
      var chatData = {
        chatName: productName,
        users: [req.user._id, userId],
      }

      const createdChat = await chatModel.create(chatData)
      const FullChat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate("users", "-password")
      res.status(200).send({
        success: true,
        message: "message send successfully",
        chat: FullChat,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in creating",
      error,
    })
  }
}

const fetchChats = async (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        })
        res.status(200).send({
          success: true,
          message: "message fetching successfully",
          results,
        })
      })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error in fetching chats",
    })
  }
}

module.exports = { accessChat, fetchChats }

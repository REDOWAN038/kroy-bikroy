const express = require("express")
const router = express.Router()
const { sendMessage, allMessages } = require("../controllers/messageController")
const { requireSignIn } = require("../middlewares/authMiddleware")

// send message
router.post("/", requireSignIn, sendMessage)

// get all messages
router.get("/:chatId", requireSignIn, allMessages)

module.exports = router

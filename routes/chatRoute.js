const express = require("express")
const { requireSignIn } = require("../middlewares/authMiddleware")
const { accessChat, fetchChats } = require("../controllers/chatController")
const router = express.Router()

router.post("/", requireSignIn, accessChat)
router.get("/", requireSignIn, fetchChats)

module.exports = router

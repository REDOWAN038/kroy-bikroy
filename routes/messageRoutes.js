const express = require("express")
const { requireSignIn } = require("../middlewares/authMiddleware")
const { sendMessage, allMessage } = require("../controllers/messageController")
const router = express.Router();
router.route('/').post(requireSignIn, sendMessage)
router.route('/:chatId').get(requireSignIn, allMessage)
module.exports= router;

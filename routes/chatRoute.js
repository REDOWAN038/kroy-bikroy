const express = require("express");
const {
  accessChat,
  fetchChats,
//   createGroupChat,
//   removeFromGroup,
//   addToGroup,
//   renameGroup,
} = require("../controllers/chatController");
const { requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();
console.log("ALhamdulilah");

router.route("/").post(requireSignIn, accessChat);
router.route("/").get(requireSignIn, fetchChats);
// router.route("/group").post(protect, createGroupChat);
// router.route("/rename").put(protect, renameGroup);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
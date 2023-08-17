const express = require("express")
// const router = express.Router()
const {
  getUsersController,
  addToWishlist,
  getWishLists,
  removeFromWishlist,
} = require("../controllers/userController")
const { requireSignIn } = require("../middlewares/authMiddleware")
const router = express.Router()

//getting all users
router.get("/get-users", requireSignIn, getUsersController)

// add to wish list
router.post("/add-wishlist", requireSignIn, addToWishlist)

// get wishlist
router.get("/get-wishlists", getWishLists)

// remove from wishlist
router.delete("/remove-from-wishlist", removeFromWishlist)

module.exports = router

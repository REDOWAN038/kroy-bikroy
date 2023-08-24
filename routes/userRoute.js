const express = require("express")
// const router = express.Router()
const {
  getUsersController,
  addToWishlist,
  getWishLists,
  removeFromWishlist,
  deleteUserController,
} = require("../controllers/userController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

//getting all users
router.get("/get-users", requireSignIn, getUsersController)

// add to wish list
router.post("/add-wishlist", requireSignIn, addToWishlist)

// get wishlist
router.get("/get-wishlists", getWishLists)

// remove from wishlist
router.delete("/remove-from-wishlist", removeFromWishlist)

// deleting user
router.delete(
  "/remove-user/:sellerId",
  requireSignIn,
  isAdmin,
  deleteUserController
)

module.exports = router

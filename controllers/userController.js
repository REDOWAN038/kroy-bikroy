const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const slugify = require("slugify")

const getUsersController = async (req, res) => {
  try {
    const users = await userModel.find({})
    res.status(200).send({
      success: true,
      message: "User Lists",
      users,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting users",
    })
  }
}

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const user = await userModel.findById(req.user._id)

    if (user && user.wishlist.includes(productId)) {
      return res.status(208).send({
        success: true,
        message: "Already in the WishList",
      })
    }

    await userModel.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: productId },
    })

    res.status(200).send({
      success: true,
      message: "Items Added to WishList",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error While Adding to Wishlist",
    })
  }
}

const getWishLists = async (req, res) => {
  try {
    const { userId } = req.query
    //console.log(userId)
    //const userId = "64ddaa0f14ec0547f89fb781"
    const user = await userModel.findById(userId).populate("wishlist")

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" })
    }

    res.status(200).send({
      success: true,
      message: "wishlist items",
      wishlists: user.wishlist,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error While Adding to Wishlist",
    })
  }
}

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } }, // Remove the specified product ID from the wishlist array
      { new: true }
    )

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" })
    }

    res.status(200).send({
      success: true,
      message: "Product removed from wishlist",
      updatedWishlist: user.wishlist,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while removing from wishlist",
    })
  }
}

module.exports = {
  getUsersController,
  addToWishlist,
  getWishLists,
  removeFromWishlist,
}

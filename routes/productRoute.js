const express = require("express")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const {
  createProductController,
  getAllProductController,
  getSingleProductController,
  getProductImageController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController,
} = require("../controllers/productController")
const formidable = require("express-formidable")
const router = express.Router()

// create product

router.post(
  "/create-product",
  requireSignIn,
  formidable(),
  createProductController
)

// get all products

router.get("/get-products", getAllProductController)

// get single product

router.get("/get-product/:slug", getSingleProductController)

// update product

router.put(
  "/update-product/:pid",
  requireSignIn,
  formidable(),
  updateProductController
)

// get product photo

router.get("/product-photo/:pid/:imageid", getProductImageController)

// delete product

router.delete("/delete-product/:pid", requireSignIn, deleteProductController)

// filtering

router.post("/filter-products", productFilterController)

// product count
router.get("/product-count", productCountController)

//product per page
router.get("/product-list/:page", productListController)

// search product
router.get("/search/:keyword", searchProductController)

//similar product
router.get("/related-product/:pid/:cid", realtedProductController)

module.exports = router

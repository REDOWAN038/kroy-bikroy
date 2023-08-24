const productModel = require("../models/productModel")
const slugify = require("slugify")
const fs = require("fs")

const createProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      available,
      address,
      seller,
    } = req.fields
    const { image } = req.files

    //validation

    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" })
      case !address:
        return res.status(500).send({ error: "address is required" })
      case !seller:
        return res.status(500).send({ error: "seller is required" })
      case !image || image.size > 1000000:
        return res
          .status(500)
          .send({ error: "image is required and should be less than 1 mb" })
      case !description:
        return res.status(500).send({ error: "description is required" })
      case !price:
        return res.status(500).send({ error: "price is required" })
      case !category:
        return res.status(500).send({ error: "category is required" })
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) })
    if (image) {
      products.image.data = fs.readFileSync(image.path)
      products.image.contentType = image.type
    }
    await products.save()
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    })
  }
}

const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-image")
      .limit(12)
      .sort({ createdAt: -1 })

    res.status(200).send({
      success: true,
      total: products.length,
      message: "Fetching All Products Successfully",
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching products",
    })
  }
}

const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-image")
      .populate("category")

    res.status(200).send({
      success: true,
      message: "Fetching Single Product Successfully",
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching product",
    })
  }
}

const updateProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      available,
      address,
      seller,
    } = req.fields
    const { image } = req.files

    //validation

    // switch (true) {
    //   case !name:
    //     return res.status(500).send({ error: "name is required" })
    //   case !address:
    //     return res.status(500).send({ error: "address is required" })
    //   case !seller:
    //     return res.status(500).send({ error: "seller is required" })
    //   case !image || image.size > 1000000:
    //     return res
    //       .status(500)
    //       .send({ error: "image is required and should be less than 1 mb" })
    //   case !description:
    //     return res.status(500).send({ error: "description is required" })
    //   case !price:
    //     return res.status(500).send({ error: "price is required" })
    //   case !category:
    //     return res.status(500).send({ error: "category is required" })
    // }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    )
    if (image) {
      products.image.data = fs.readFileSync(image.path)
      products.image.contentType = image.type
    }
    await products.save()
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    })
  }
}

const getProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("image")
    if (product.image.data) {
      res.set("Content-type", product.image.contentType)
      return res.status(200).send(product.image.data)
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching product image",
    })
  }
}

const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-image")
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting product",
    })
  }
}

const productFilterController = async (req, res) => {
  try {
    const { filter, min, max, selectedCategoryId } = req.body
    let args = {}
    if (selectedCategoryId) {
      args.category = selectedCategoryId
    }
    if (filter) {
      args.price = { $gte: min, $lte: max }
    }
    const products = await productModel.find(args)
    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error,
      message: "Error in filtering products",
    })
  }
}

const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error,
      message: "Error in product count",
    })
  }
}

const productListController = async (req, res) => {
  try {
    const perPage = 6
    const page = req.params.page ? req.params.page : 1
    const products = await productModel
      .find({})
      .select("-image")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })

    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error,
      message: "Error in product page",
    })
  }
}

// search product
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params
    const results = await productModel
      .find({
        $or: [{ name: { $regex: keyword, $options: "i" } }],
      })
      .select("-image")
    res.json(results)
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      error,
      message: "Error in search page",
    })
  }
}

// similar products
const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-image")
      .limit(3)
      .populate("category")
    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    })
  }
}

module.exports = {
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
}

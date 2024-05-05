const categoryModel = require("../models/categoryModel")
const productModel = require("../models/productModel")
const slugify = require("slugify")

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(401).send({ message: "Name is required" })
    }

    const existingCategory = await categoryModel.findOne({ name })
    if (existingCategory) {
      return res
        .status(200)
        .send({ success: false, message: "Category Already Exists" })
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save()
    res.status(201).send({
      success: true,
      message: "Category Created Successfully",
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating category",
    })
  }
}

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params
    //await productModel.updateMany({ category: slugify(name) })
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    )
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    })
  }
}

const getCategoriesController = async (req, res) => {
  try {
    const category = await categoryModel.find({})
    res.status(200).send({
      success: true,
      message: "Category Lists",
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    })
  }
}

const getSingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug })
    res.status(200).send({
      success: true,
      message: "Single Category List",
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    })
  }
}

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params
    await productModel.deleteMany({ category: id })
    await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    })
  }
}

module.exports = {
  createCategoryController,
  updateCategoryController,
  getCategoriesController,
  getSingleCategoryController,
  deleteCategoryController,
}

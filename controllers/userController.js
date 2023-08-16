const userModel = require("../models/userModel")
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

module.exports = { getUsersController }

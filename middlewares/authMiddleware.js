const JWT = require("jsonwebtoken")
const userModel = require("../models/userModel")

const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = JWT.verify(token, process.env.JWT_SECRET)
    req.user = decode
    console.log("HI", decode);
    next()
  } catch (error) {
    console.log("token erro");
    console.log(error)
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id)
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "unauthorized access",
      })
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { requireSignIn, isAdmin }

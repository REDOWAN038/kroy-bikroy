const userModel = require("../models/userModel")
const { hashPassword, comparePassword } = require("../helpers/authHelper")
const JWT = require("jsonwebtoken")

const register = async (req, res) => {
  try {
    const { reg_no, email, name, phone, password } = req.body
    console.log(req.body);

    //validations
    if (!reg_no) {
      return res.send({ message: "registration number is required" })
    }

    if (!name) {
      return res.send({ message: "name is required" })
    }

    if (!email) {
      return res.send({ message: "email is required" })
    }

    if (!password) {
      return res.send({ message: "password is required" })
    }

    if (!phone) {
      return res.send({ message: "phone is required" })
    }

    // cheacking existing user
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "already registered. please login",
      })
    }

    // register user
    const hashedPassword = await hashPassword(password)
    const user = await new userModel({
      name,
      email,
      phone,
      reg_no,
      password: hashedPassword,
    }).save()

    res.status(201).send({
      success: true,
      message: "registration successful",
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    })
  }
}

const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invalid user credentials",
      })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not registered",
      })
    }
    
    const match = await comparePassword(password, user.password)
    
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "incorrect password",
      })
    }
    
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })


    res.status(200).send({
      success: true,
      message: "login successful",
      user: {
        id: user._id,
        reg_no: user.reg_no,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    })
  }
}

module.exports = { register, login }

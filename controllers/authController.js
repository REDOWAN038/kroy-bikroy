const userModel = require("../models/userModel")
const { hashPassword, comparePassword } = require("../helpers/authHelper")
const JWT = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const register = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body

    //validations

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
      password: hashedPassword,
      wishlist: [],
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
    const { email, password } = req.body
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
      wishlist: user.wishlist,
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

const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    const user = await userModel.findById(req.user._id)

    const hashedPassword = password ? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
      },
      { new: true }
    )
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    })
  }
}

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(404).send({
        success: false,
        message: "please provide your email",
      })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not registered",
      })
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    })

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: email, // list of receivers
      subject: "Reset Your Password",
      text: `http://localhost:3000/reset-password/${user._id}/${token}`,
    })

    res.status(200).send({
      success: true,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Updating Password",
      error,
    })
  }
}

const resetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params
    const { password } = req.body

    const decode = JWT.verify(token, process.env.JWT_SECRET)

    if (decode) {
      const hashedPassword = await hashPassword(password)
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        {
          password: hashedPassword,
        },
        { new: true }
      )
      res.status(200).send({
        success: true,
        message: "Password Updated SUccessfully",
        updatedUser,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Updating Password",
      error,
    })
  }
}

module.exports = {
  register,
  login,
  updateProfileController,
  forgotPasswordController,
  resetPasswordController,
}

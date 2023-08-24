const express = require("express")
const router = express.Router()
const {
  register,
  login,
  updateProfileController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/authController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")

router.post("/register", register)
router.post("/login", login)

// protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true })
})

// protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true })
})

//update profile
router.put("/update-profile", requireSignIn, updateProfileController)

// forgot password
router.post("/forgot-password", forgotPasswordController)

// reset password
router.put("/reset-password/:id/:token", resetPasswordController)

module.exports = router

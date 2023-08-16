const express = require("express")
const { getUsersController } = require("../controllers/userController")
const router = express.Router()

//getting all users
router.get("/get-users", getUsersController)

module.exports = router

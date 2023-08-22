const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const connectDB = require("./config/db.js")
const authRoutes = require("./routes/authRoute")
const categoryRoutes = require("./routes/categoryRoute")
const productRoutes = require("./routes/productRoute")
const userRoutes = require("./routes/userRoute")
const chatRoutes = require("./routes/chatRoute")
const messageRoutes = require("./routes/messageRoute")
const cors = require("cors")

//configure env
dotenv.config()

//rest object
const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/chat", chatRoutes)
app.use("/api/v1/message", messageRoutes)

//rest api
app.get("/", (req, res) => {
  res.send("welcome")
})

//port
const PORT = process.env.PORT || 8080

//run listen
const server = app.listen(PORT, () => {
  try {
    // database config
    connectDB()
    console.log(`port is listening on ${PORT}`)
  } catch (error) {
    console.log(error)
  }
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
})

io.on("connection", (socket) => {
  console.log("connected to socket.io")

  socket.on("setup", (userData) => {
    console.log(userData)
    socket.join(userData.id)
    socket.emit("connected")
  })

  socket.on("join chat", (room) => {
    socket.join(room)
    console.log("User Joined Room: " + room)
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"))

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat

    if (!chat.users) return console.log("chat.users not defined")

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return

      socket.in(user._id).emit("message recieved", newMessageRecieved)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED")
    socket.leave(userData._id)
  })
})

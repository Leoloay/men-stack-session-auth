const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require("express-session")
const isSignedIn = require("./middleware/is-signed-in")
const passUserToView = require("./middleware/pass-user-to-view")

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`connected to MongoDB ${mongoose.connection.name}`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passUserToView)
app.use((req, res, next) => {
  if (req.session.message) {
    res.locals.message = req.session.message
    req.session.message = null
  } else {
    res.locals.message = null
  }
  next()
})

// Required controller

const authController = require("./controllers/auth")

// Use Controller

app.use("/auth", authController)

//Landing Page

app.get("/", async (req, res) => {
  //res.send("Hello, World...")
  res.render("index.ejs") //, { user: req.session.user })
})

app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}`)
  // if (req.session.user) {
  //   res.send(`Welcome to the party ${req.session.user.username}`)
  // } else {
  //   res.send(`Sorry, no guests allowed`)
  // }
})

app.listen(3000, () => {
  console.log(`This Express app is connected to PORT ${process.env.PORT}`)
})

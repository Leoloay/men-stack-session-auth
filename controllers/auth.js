const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs")
})

router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send("Username already taken")
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match")
  }
  // Register the user
  // bcrypt for the password encryption

  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  //Create the user
  const user = await User.create(req.body)
  res.send(`Thanks for signing up ${user.username}`)

  //Save the record
})

//Sign-in

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs")
})

router.post("/sign-in", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })

    if (!userInDatabase) {
      return res.send("Login failed. Please try again!")
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )

    if (!validPassword) {
      return res.send("Login failed. Please try again!")
    }
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    }

    res.redirect("/")
  } catch (err) {
    console.log(err)
    res.session.message = "Please try again later"
  }
})

router.get("/sign-out", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})
//Login the user

module.exports = router

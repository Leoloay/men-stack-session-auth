const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, "Username must be more than 3 characters!"],
      maxlength: [10, "This is too much man, chill!"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // means createdAt & updatedAT
  }
)

const User = mongoose.model("User", userSchema)

module.exports = User

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "ismni kiriting"],
    },
    email: {
      type: String,
      required: [true, "emailni kiriting"],
      unique: true,
      //   match: [
      //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //     "Please add a valid E-mail",
      //   ],
    },
    password: {
      type: String,
      required: [true, "parolni kiriting"],
    },
    otp: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timesTamps: true }
);

module.exports = mongoose.model("userModel", userSchema);

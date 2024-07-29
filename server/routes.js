const express = require("express");
const userModel = require("./model/userModel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res.status(404).send({
      success: false,
      message: "bu odan royxatdan otgan",
    });
  }
  //  parolni shifrlash
  let salt = bcrypt.genSaltSync(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    userName,
    email,
    password: passwordHash,
  });
  await user.save();
  res.status(201).send({
    success: true,
    message: "foydalanuvchi qo'shildi",
    user,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.send({ success: false, message: "bu odam yuq" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.send({ success: false, message: "parol xato" });
  }

  const token = jwt.sign({ id: user.id }, process.env.KEY, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
  return res.send({ success: true, message: "login success" });
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    let generateOTP = Math.floor(Math.random() * 10000);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAILIM,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAILIM,
      to: email,
      subject: "Reset Password",
      text: "c",
      html: `<b>OTP is: <i>${generateOTP}</i></b>`,
    });
    if (info.messageId) {
      let user = await userModel.findByIdAndUpdate(
        { email },
        { otp: generateOTP },
        { new: true }
      );
      if (!user) {
        return res.status(400).send({ message: "user does not exist" });
      }
    }
    return res.status(200).send({ message: "otp sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;

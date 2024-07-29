const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
const appRouter = require("./routes");

const cors = require("cors");
const datDB = require("./db/db");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:3000",
  //   credentials: true, //access-control-allow-credentials:true
  //   optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// const otbCache = {};

// // generate otp
// function generateOTP() {
//   return randomstring.generate({ length: 4, charset: "numeric" });
// }

app.use("/api", appRouter);
datDB();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`${port}-da ishladi`);
});

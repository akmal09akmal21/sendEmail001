const mongoose = require("mongoose");
// DB = mongodb://localhost:27017/loginpage
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("db ga ulandi");
  } catch (error) {
    console.log("db dan xatolik" + "  " + error);
  }
};
module.exports = connectDB;

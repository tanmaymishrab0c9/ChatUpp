const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://tanmaymishra747_db_user:R7lSUiHvPI1UvIoG@cluster0.p7o1zmb.mongodb.net/?appName=Cluster0/chatupp");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
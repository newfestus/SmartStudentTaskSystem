const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

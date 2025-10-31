import mongoose from "mongoose";
import "dotenv/config";



const MONGO_URI = process.env.MONGO_URI 

 async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");

    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); 
  }
}


export default connectDB;
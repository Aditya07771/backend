import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import approutes from "./src/route.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", approutes);

// Server
app.listen(9000, () => console.log("🚀 Server running on port 9000"));

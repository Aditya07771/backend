import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./src/config/db.js";
import approutes from "./src/route.js";
import { setupChatSocket } from "./src/socket/chatHandler.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, specify your Android app
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", approutes);

// Setup Socket.IO
setupChatSocket(io);

app.get("/", (req, res) => {
  res.send("API is running with Socket.IO");
});

// Server
const PORT = process.env.PORT || 9000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
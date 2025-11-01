import authRoutes from "../src/routes/authRoutes.js";
import deviceRoutes from "../src/routes/deviceroute.js";
import locationRoutes from "../src/routes/locationRoutes.js";
import chatRoutes from "../src/routes/chatRoutes.js"; // NEW
import express from "express";

const app = express.Router();

app.use("/auth", authRoutes);
app.use("/device", deviceRoutes);
app.use("/location", locationRoutes);
app.use("/chat", chatRoutes); // NEW

export default app;
import authRoutes from "../src/routes/authRoutes.js";
import deviceRoutes from "../src/routes/deviceroute.js";
import locationRoutes from "../src/routes/locationRoutes.js";
import express from "express";


const app = express.Router();

app.use("/api/auth", authRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/location", locationRoutes);


export default app

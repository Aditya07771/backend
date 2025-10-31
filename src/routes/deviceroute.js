import express from "express";
import Device from "../models/Device.js";
import Lost from "../models/lost.js";

const router = express.Router();

// Report lost device
router.post("/reportlost/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  const device = await Device.findOne({ deviceid: deviceId });

  if (!device)
    return res.status(404).json({ success: false, message: "Device not found" });

  await Lost.create({ deviceid: deviceId, username: device.username });
  res.json({ success: true, message: "Device reported lost" });
});

// Get device by ID
router.get("/device/:id", async (req, res) => {
  const device = await Device.findOne({ deviceid: req.params.id });
  if (!device) return res.status(404).json({ message: "Device not found" });

  res.json({
    id: device.deviceid,
    name: device.devicename,
    location: { lat: device.lat, lng: device.lon },
    lastSeen: device.time,
  });
});

export default router;

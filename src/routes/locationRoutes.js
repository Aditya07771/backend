import express from "express";
import Track from "../models/Track.js";

const router = express.Router();

// Save location
router.post("/setlocation", async (req, res) => {
  const { deviceId, latitude, longitude } = req.body;
  if (!deviceId || !latitude || !longitude)
    return res.status(400).json({ error: "Missing fields" });

  try {
    await Track.create({ deviceid: deviceId, latitude, longitude });
    res.json({ success: true, message: "Location saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get latest location
router.get("/getlocation/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  const locations = await Track.find({ deviceid: deviceId }).sort({ timestamp: -1 });

  if (locations.length === 0)
    return res.status(404).json({ success: false, message: "Not found" });

  res.json({ success: true, data: locations });
});

export default router;

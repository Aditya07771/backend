import express from "express";
import Device from "../models/device.js";
import Lost from "../models/lost.js";
import Family from "../models/familyModel.js";
import { sendEmail } from "../config/email.js";

const router = express.Router();

router.post("/addFamily", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Name and Email are required" });
  }

  try {
    // Save to MongoDB
    const familyMember = new Family({ name, email });
    await familyMember.save();

    // Send Email
    await sendEmail(
      email,
      "Welcome to Family Tracker",
      `Hello ${name},\n\nYou’ve been added to the Family Tracker system!\n\n— Team Tracker`
    );

    res.status(200).json({
      success: true,
      message: "Family member added and email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding member or sending email",
      });
  }
});

// Report lost device
router.post("/reportlost/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  const device = await Device.findOne({ deviceid: deviceId });

  if (!device)
    return res
      .status(404)
      .json({ success: false, message: "Device not found" });

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

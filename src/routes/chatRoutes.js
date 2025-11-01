import express from "express";
import ChatSession from "../models/chatSession.js";
import Message from "../models/message.js";
import { sendEmail } from "../config/email.js";
import Family from "../models/familyModel.js";

const router = express.Router();

// Create a new chat session (called when device is found)
router.post("/create-session", async (req, res) => {
  const { deviceId, ownerId } = req.body;

  if (!deviceId || !ownerId) {
    return res.status(400).json({ 
      success: false, 
      message: "Device ID and Owner ID are required" 
    });
  }

  try {
    const sessionId = `chat_${deviceId}_${Date.now()}`;
    
    const session = new ChatSession({
      sessionId,
      deviceId,
      ownerId,
      isActive: true
    });

    await session.save();

    res.json({ 
      success: true, 
      sessionId,
      message: "Chat session created" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Get chat history
router.get("/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(100);

    res.json({ 
      success: true, 
      messages 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Get active sessions for a user
router.get("/sessions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const sessions = await ChatSession.find({
      $or: [{ ownerId: userId }, { helperId: userId }],
      isActive: true
    }).sort({ lastActivity: -1 });

    res.json({ 
      success: true, 
      sessions 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Close chat session
router.post("/close-session", async (req, res) => {
  const { sessionId } = req.body;

  try {
    await ChatSession.findOneAndUpdate(
      { sessionId },
      { isActive: false }
    );

    res.json({ 
      success: true, 
      message: "Chat session closed" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Notify family members about found device
router.post("/notify-family", async (req, res) => {
  const { deviceId, sessionId } = req.body;

  try {
    const familyMembers = await Family.find({});
    
    for (const member of familyMembers) {
      const chatLink = `https://yourapp.com/chat/${sessionId}`;
      await sendEmail(
        member.email,
        "Device Found - Action Required",
        `
          <h2>Good News! A device has been found.</h2>
          <p>Device ID: ${deviceId}</p>
          <p>Someone found this device and wants to return it.</p>
          <p><a href="${chatLink}">Click here to chat with the finder</a></p>
          <p>This chat link will expire in 24 hours.</p>
        `
      );
    }

    res.json({ 
      success: true, 
      message: "Family members notified" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

export default router;
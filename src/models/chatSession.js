import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  sessionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  deviceId: { 
    type: String, 
    required: true 
  },
  ownerId: { 
    type: String, 
    required: true 
  },
  helperId: { 
    type: String, 
    default: null 
  },
  ownerSocketId: String,
  helperSocketId: String,
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  },
  lastActivity: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("ChatSession", chatSessionSchema);
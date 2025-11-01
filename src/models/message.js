import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sessionId: { 
    type: String, 
    required: true,
    index: true
  },
  senderId: { 
    type: String, 
    required: true 
  },
  senderType: { 
    type: String, 
    enum: ['owner', 'helper'],
    required: true 
  },
  message: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  },
  isRead: { 
    type: Boolean, 
    default: false 
  }
});

export default mongoose.model("Message", messageSchema);
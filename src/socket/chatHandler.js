import ChatSession from "../models/chatSession.js";
import Message from "../models/message.js";

export function setupChatSocket(io) {
  const typingUsers = new Map(); // Track typing users

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join a chat room
    socket.on("join_chat", async (data) => {
      const { sessionId, userId, userType } = data;

      try {
        const session = await ChatSession.findOne({ sessionId });

        if (!session) {
          socket.emit("error", { message: "Chat session not found" });
          return;
        }

        // Update session with socket ID
        if (userType === "owner") {
          session.ownerSocketId = socket.id;
        } else if (userType === "helper") {
          session.helperId = userId;
          session.helperSocketId = socket.id;
        }

        session.lastActivity = new Date();
        await session.save();

        socket.join(sessionId);

        // Load and send chat history
        const messages = await Message.find({ sessionId })
          .sort({ timestamp: 1 })
          .limit(100);

        socket.emit("chat_history", { messages });
        socket.emit("joined_chat", { sessionId });

        // Notify other user that someone joined
        socket.to(sessionId).emit("user_joined", { 
          userType,
          message: `${userType === 'owner' ? 'Owner' : 'Helper'} has joined the chat` 
        });

        console.log(`User ${userId} joined chat ${sessionId} as ${userType}`);
      } catch (err) {
        console.error("Error joining chat:", err);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Send message
    socket.on("send_message", async (data) => {
      const { sessionId, senderId, senderType, message } = data;

      try {
        // Save message to database
        const newMessage = new Message({
          sessionId,
          senderId,
          senderType,
          message,
          timestamp: new Date()
        });

        await newMessage.save();

        // Update session activity
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { lastActivity: new Date() }
        );

        // Broadcast message to room
        io.to(sessionId).emit("new_message", {
          messageId: newMessage._id,
          senderId,
          senderType,
          message,
          timestamp: newMessage.timestamp
        });

        // Stop typing indicator
        typingUsers.delete(`${sessionId}_${senderId}`);
        io.to(sessionId).emit("user_stopped_typing", { userId: senderId });

        console.log(`Message sent in ${sessionId} by ${senderId}`);
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing_start", (data) => {
      const { sessionId, userId } = data;
      typingUsers.set(`${sessionId}_${userId}`, true);
      socket.to(sessionId).emit("user_typing", { userId });
    });

    socket.on("typing_stop", (data) => {
      const { sessionId, userId } = data;
      typingUsers.delete(`${sessionId}_${userId}`);
      socket.to(sessionId).emit("user_stopped_typing", { userId });
    });

    // Mark messages as read
    socket.on("mark_as_read", async (data) => {
      const { sessionId, userId } = data;

      try {
        await Message.updateMany(
          { 
            sessionId, 
            senderId: { $ne: userId },
            isRead: false 
          },
          { isRead: true }
        );

        socket.to(sessionId).emit("messages_read", { userId });
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`❌ User disconnected: ${socket.id}`);

      try {
        // Find and update session
        const session = await ChatSession.findOne({
          $or: [
            { ownerSocketId: socket.id },
            { helperSocketId: socket.id }
          ]
        });

        if (session) {
          const userType = session.ownerSocketId === socket.id ? 'owner' : 'helper';
          
          // Clear socket ID
          if (userType === 'owner') {
            session.ownerSocketId = null;
          } else {
            session.helperSocketId = null;
          }
          
          await session.save();

          // Notify other user
          socket.to(session.sessionId).emit("user_disconnected", { 
            userType,
            message: `${userType === 'owner' ? 'Owner' : 'Helper'} disconnected` 
          });

          // Clean up typing indicator
          typingUsers.delete(`${session.sessionId}_${userType}`);
        }
      } catch (err) {
        console.error("Error handling disconnect:", err);
      }
    });

    // Leave chat
    socket.on("leave_chat", async (data) => {
      const { sessionId } = data;
      socket.leave(sessionId);
      socket.emit("left_chat", { sessionId });
    });
  });
}
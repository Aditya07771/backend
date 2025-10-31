import mongoose from "mongoose";

const lostSchema = new mongoose.Schema({
  deviceid: String,
  username: String,
  reportedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Lost", lostSchema);

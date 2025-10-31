import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  deviceid: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Track", trackSchema);

import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  deviceid: { type: String, required: true, unique: true },
  devicename: String,
  username: String, // linked to user
  lat: Number,
  lon: Number,
  address: String,
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Device", deviceSchema);

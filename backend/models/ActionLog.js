import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  action: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: Date, default: Date.now },
});

export default mongoose.model("ActionLog", actionLogSchema);

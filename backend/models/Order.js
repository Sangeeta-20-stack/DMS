import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  time: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema(
  {
    items: [{ type: String }],
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    stage: {
      type: String,
      enum: [
        "Order Placed",
        "Buyer Associated",
        "Processing",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered"
      ],
      default: "Order Placed"
    },
    timestamps: {
      type: Map,
      of: Date,
      default: {}
    },
    logs: { type: [logSchema], default: [] },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

import Order from "../models/Order.js";
import User from "../models/User.js";

// --------------------
// Admin: Get all orders
// --------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deleted: false })
      .populate("buyer", "name email _id")
      .populate("seller", "name email _id")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Buyer: Create new order
// --------------------
export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;

    // Check for existing active order
    const activeOrder = await Order.findOne({
      buyer: buyerId,
      stage: { $ne: "Delivered" },
      deleted: false,
    });
    if (activeOrder)
      return res.status(400).json({ message: "You already have an active order." });

    const { items, sellerId } = req.body; // Include sellerId to assign

    const order = await Order.create({
      items,
      seller: sellerId, 
      logs: [{ actor: buyerId, action: "Order Placed", time: new Date() }],
      timestamps: { "Order Placed": new Date() },
      stage: "Order Placed",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Seller: Get all orders assigned to this seller
// --------------------
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ seller: sellerId, deleted: false })
      .populate("buyer", "name email _id")
      .populate("seller", "name email _id")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Seller: Move order to next stage
// --------------------
export const moveSellerOrderNextStage = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const order = await Order.findOne({
      _id: req.params.id,
      seller: sellerId,
      deleted: false,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const stages = [
      "Order Placed",
      "Buyer Associated",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    const currentIndex = stages.indexOf(order.stage);
    if (currentIndex === -1)
      return res.status(400).json({ message: "Invalid order stage" });
    if (currentIndex === stages.length - 1)
      return res.status(400).json({ message: "Order already delivered" });

    order.stage = stages[currentIndex + 1];
    order.timestamps[order.stage] = new Date();
    order.logs.push({
      actor: sellerId,
      action: `Moved to ${order.stage}`,
      time: new Date(),
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Admin: Associate buyer to an order
// --------------------
export const associateBuyer = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const buyer = await User.findById(req.body.buyerId);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    order.buyer = buyer._id;
    order.stage = "Buyer Associated";
    order.timestamps["Buyer Associated"] = new Date();
    order.logs.push({ actor: req.user._id, action: "Buyer Associated", time: new Date() });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Admin: View order details with stage durations and logs
// --------------------
export const viewOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email _id")
      .populate("seller", "name email _id");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const durations = {};
    const stageNames = Object.keys(order.timestamps);
    for (let i = 1; i < stageNames.length; i++) {
      const prev = order.timestamps[stageNames[i - 1]];
      const curr = order.timestamps[stageNames[i]];
      durations[`${stageNames[i - 1]} → ${stageNames[i]}`] = curr - prev;
    }

    res.json({ order, durations, logs: order.logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// Admin/Seller: Soft delete an order
// --------------------
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deleted = true;
    order.logs.push({ actor: req.user._id, action: "Order Deleted", time: new Date() });

    await order.save();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



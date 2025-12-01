import Order from "../models/Order.js";

// ------------------------------------------
// Get active order for logged-in buyer
// ------------------------------------------
export const getActiveOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const order = await Order.findOne({
      buyer: buyerId,
      stage: { $ne: "Delivered" },
      deleted: false
    }).populate("seller", "name email _id");

    if (!order)
      return res.status(404).json({ message: "No active order found." });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------
// Get order history for logged-in buyer
// ------------------------------------------
export const getOrderHistory = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const orders = await Order.find({
      buyer: buyerId,
      $or: [{ stage: "Delivered" }, { deleted: true }]
    })
      .populate("seller", "name email _id")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------
// Move buyer's active order to next stage
// ------------------------------------------
export const moveMyOrderNextStage = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const order = await Order.findOne({
      _id: req.params.id,
      buyer: buyerId,
      deleted: false
    });

    if (!order)
      return res.status(404).json({ message: "Order not found." });

    const stages = [
      "Order Placed",
      "Buyer Associated",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered"
    ];

    const currentIndex = stages.indexOf(order.stage);
    if (currentIndex === -1)
      return res.status(400).json({ message: "Invalid order stage." });
    if (currentIndex === stages.length - 1)
      return res.status(400).json({ message: "Order already delivered." });

    order.stage = stages[currentIndex + 1];
    order.timestamps[order.stage] = new Date();
    order.logs.push({ actor: buyerId, action: `Moved to ${order.stage}`, time: new Date() });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------
// Cancel (soft delete) buyer's active order
// ------------------------------------------
export const cancelOrder = async (req, res) => {
  try {
    const buyerId = req.user._id;

    const order = await Order.findOne({
      _id: req.params.id,
      buyer: buyerId,
      stage: { $ne: "Delivered" },
      deleted: false
    });

    if (!order)
      return res.status(404).json({ message: "Active order not found." });

    order.deleted = true;
    order.logs.push({ actor: buyerId, action: "Cancelled Order", time: new Date() });
    await order.save();

    res.json({ message: "Order cancelled successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

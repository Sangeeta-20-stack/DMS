import Order from "../models/Order.js";

// Get all orders assigned to seller
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id, deleted: false })
      .populate("buyer", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Move order to next stage
export const advanceOrderStage = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, seller: req.user._id, deleted: false });
    if (!order) return res.status(404).json({ message: "Order not found" });

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
    if (currentIndex === -1 || currentIndex === stages.length - 1) {
      return res.status(400).json({ message: "Cannot advance stage" });
    }

    order.stage = stages[currentIndex + 1];
    order.timestamps.set(order.stage, new Date());
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete order (soft delete recommended)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, seller: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deleted = true; // soft delete
    await order.save();

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

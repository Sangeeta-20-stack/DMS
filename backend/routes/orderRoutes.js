import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  createOrder,
  
  associateBuyer,
  viewOrderDetails,
  deleteOrder
} from "../controllers/orderController.js";
import {
  getActiveOrder,
  getOrderHistory,
  cancelOrder,
  moveMyOrderNextStage
} from "../controllers/buyerController.js";
import Order from "../models/Order.js";

const router = express.Router();

// --------------------
// Admin Routes
// --------------------
router.get("/", protect, authorize("admin"), getAllOrders); // Get all orders
router.post("/:id/associate", protect, authorize("admin"), associateBuyer); // Associate buyer to order
router.get("/:id/details", protect, authorize("admin"), viewOrderDetails); // View order details
router.delete("/:id", protect, authorize("admin", "seller"), deleteOrder); // Soft delete order

// --------------------
// Buyer Routes
// --------------------
router.post("/", protect, authorize("buyer"), createOrder); // Create a new order
//router.get("/", protect, authorize("buyer"), getAllOrders);
router.get("/active", protect, authorize("buyer"), getActiveOrder); // Get buyer's active order
router.get("/history", protect, authorize("buyer"), getOrderHistory); // Get buyer's order history
router.post("/:id/next", protect, authorize("buyer"), moveMyOrderNextStage); // Move buyer's order to next stage
router.delete("/:id/cancel", protect, authorize("buyer"), cancelOrder); // Cancel active order

// --------------------
// Seller Routes
// --------------------
//router.post("/:id/next", protect, authorize("seller"), moveNextStage); // Move order to next stage
// --------------------
// Seller Routes
// --------------------

// Get all orders assigned to the seller
router.get("/seller/orders", protect, authorize("seller"), async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id, deleted: false })
      .populate("buyer", "name email");
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Move order to next stage
router.patch("/seller/orders/:id/advance", protect, authorize("seller"), async (req, res, next) => {
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
    next(err);
  }
});

// Delete an order (soft delete)
router.delete("/seller/orders/:id", protect, authorize("seller"), async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, seller: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deleted = true;
    await order.save();

    res.json({ message: "Order deleted" });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/assign-seller", protect, authorize("admin"), async (req, res) => {
  const { sellerId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.seller = sellerId;
  if (order.stage === "Order Placed") order.stage = "Buyer Associated";
  order.timestamps["Buyer Associated"] = new Date();
  await order.save();

  res.json(order);
});





export default router;

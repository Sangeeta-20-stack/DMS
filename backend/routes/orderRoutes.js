import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  createOrder,
  moveNextStage,
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

export default router;

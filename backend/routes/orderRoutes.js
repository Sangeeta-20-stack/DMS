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

const router = express.Router();

// --------------------
// Admin Routes
// --------------------
router.get("/", protect, authorize("admin"), getAllOrders); // get all orders
router.post("/:id/associate", protect, authorize("admin"), associateBuyer); // associate buyer
router.get("/:id/details", protect, authorize("admin"), viewOrderDetails); // view order details
router.delete("/:id", protect, authorize("admin", "seller"), deleteOrder); // soft delete order

// --------------------
// Buyer Routes
// --------------------
router.post("/", protect, authorize("buyer"), createOrder); // create order

// --------------------
// Seller Routes
// --------------------
router.post("/:id/next", protect, authorize("seller"), moveNextStage); // move to next stage

export default router;

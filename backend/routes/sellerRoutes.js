import express from "express";
import { getSellerOrders, advanceOrderStage, deleteOrder } from "../controllers/sellerController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// All routes protected: only seller can access
router.use(authMiddleware("seller"));

router.get("/orders", getSellerOrders);
router.patch("/orders/:id/advance", advanceOrderStage);
router.delete("/orders/:id", deleteOrder);

export default router;

import express from "express";
import { connectToCashFree, getOrderDetails } from "../controllers/orders.js";

const router = express.Router();
router.post("/", connectToCashFree);
router.get("/:order_id", getOrderDetails);

export default router;

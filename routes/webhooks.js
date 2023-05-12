import express from "express";
import { getPaymentStatus } from "../controllers/webhooks.js";

const router = express.Router();
router.post("/", getPaymentStatus);

export default router;
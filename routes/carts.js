import express from "express";
import { PostCartData } from "../controllers/carts.js";

const router = express.Router();
router.post('/', PostCartData);

export default router;


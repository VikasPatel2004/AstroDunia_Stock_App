import express from "express";

import {
  buy,
  sell,
} from "../controllers/tradeController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/buy",
  protect,
  buy
);

router.post(
  "/sell",
  protect,
  sell
);

export default router;
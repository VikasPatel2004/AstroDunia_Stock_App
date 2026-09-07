import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message: "API is running",
    });
  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/stocks",
  stockRoutes
);

app.use(
  "/api/trade",
  tradeRoutes
);

app.use(
  "/api/portfolio",
  portfolioRoutes
);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use(errorMiddleware);

export default app;
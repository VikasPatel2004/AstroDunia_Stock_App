import {
  buyStock,
  sellStock,
} from "../services/tradingService.js";

export const buy = async (
  req,
  res,
  next
) => {
  try {
    const {
      stockId,
      quantity,
    } = req.body;

    if (!stockId) {
      return res.status(400).json({
        message: "Stock ID is required",
      });
    }

    const result =
      await buyStock(
        req.user._id,
        stockId,
        quantity
      );

    res.json(result);
  } catch (error) {
    const status =
      error.message.includes(
        "not found"
      ) ||
      error.message.includes(
        "Insufficient"
      ) ||
      error.message.includes(
        "Quantity"
      )
        ? 400
        : 500;

    res.status(status).json({
      message: error.message,
    });
  }
};

export const sell = async (
  req,
  res,
  next
) => {
  try {
    const {
      stockId,
      quantity,
    } = req.body;

    if (!stockId) {
      return res.status(400).json({
        message: "Stock ID is required",
      });
    }

    const result =
      await sellStock(
        req.user._id,
        stockId,
        quantity
      );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
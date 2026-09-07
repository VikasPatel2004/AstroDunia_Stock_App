import mongoose from "mongoose";

import User from "../models/User.js";
import Stock from "../models/Stock.js";
import Holding from "../models/Holding.js";
import Transaction from "../models/Transaction.js";

const isValidQuantity = (quantity) => {
  return (
    Number.isInteger(quantity) &&
    quantity > 0
  );
};

export const buyStock = async (
  userId,
  stockId,
  quantity
) => {
  if (!isValidQuantity(quantity)) {
    throw new Error(
      "Quantity must be a positive whole number"
    );
  }

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    // Get stock from DB.
    // NEVER trust frontend price.
    const stock =
      await Stock.findById(
        stockId
      ).session(session);

    if (!stock) {
      throw new Error(
        "Stock not found"
      );
    }

    const executionPrice =
      stock.currentPrice;

    const totalAmount =
      executionPrice * quantity;

    const user =
      await User.findById(
        userId
      ).session(session);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (
      user.balance < totalAmount
    ) {
      throw new Error(
        "Insufficient virtual balance"
      );
    }

    let holding =
      await Holding.findOne({
        userId,
        stockId,
      }).session(session);

    if (holding) {
      const oldQuantity =
        holding.quantity;

      const oldAverage =
        holding.averagePurchasePrice;

      const newQuantity =
        oldQuantity + quantity;

      const newAverage =
        (
          oldQuantity * oldAverage +
          quantity * executionPrice
        ) / newQuantity;

      holding.quantity =
        newQuantity;

      holding.averagePurchasePrice =
        newAverage;

      await holding.save({
        session,
      });
    } else {
      await Holding.create(
        [
          {
            userId,
            stockId,
            quantity,
            averagePurchasePrice:
              executionPrice,
          },
        ],
        { session }
      );
    }

    user.balance -= totalAmount;

    await user.save({
      session,
    });

    await Transaction.create(
      [
        {
          userId,
          stockId,
          type: "BUY",
          quantity,
          executionPrice,
          totalAmount,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      message: `Bought ${quantity} share(s) of ${stock.symbol}`,
      balance: user.balance,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

export const sellStock = async (
  userId,
  stockId,
  quantity
) => {
  if (!isValidQuantity(quantity)) {
    throw new Error(
      "Quantity must be a positive whole number"
    );
  }

  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    const stock =
      await Stock.findById(
        stockId
      ).session(session);

    if (!stock) {
      throw new Error(
        "Stock not found"
      );
    }

    const holding =
      await Holding.findOne({
        userId,
        stockId,
      }).session(session);

    if (!holding) {
      throw new Error(
        "You do not own this stock"
      );
    }

    if (
      quantity > holding.quantity
    ) {
      throw new Error(
        "You cannot sell more shares than you own"
      );
    }

    // Backend decides price
    const executionPrice =
      stock.currentPrice;

    const totalAmount =
      executionPrice * quantity;

    const user =
      await User.findById(
        userId
      ).session(session);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    holding.quantity -= quantity;

    if (holding.quantity === 0) {
      await Holding.deleteOne(
        {
          _id: holding._id,
        },
        { session }
      );
    } else {
      await holding.save({
        session,
      });
    }

    user.balance += totalAmount;

    await user.save({
      session,
    });

    await Transaction.create(
      [
        {
          userId,
          stockId,
          type: "SELL",
          quantity,
          executionPrice,
          totalAmount,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      message: `Sold ${quantity} share(s) of ${stock.symbol}`,
      balance: user.balance,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
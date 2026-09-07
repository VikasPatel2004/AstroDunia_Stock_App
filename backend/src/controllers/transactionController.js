import Transaction from "../models/Transaction.js";

export const getTransactions =
  async (req, res, next) => {
    try {
      const transactions =
        await Transaction.find({
          userId: req.user._id,
        })
          .populate(
            "stockId",
            "companyName symbol"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        transactions,
      });
    } catch (error) {
      next(error);
    }
  };
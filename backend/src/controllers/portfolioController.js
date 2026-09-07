import Holding from "../models/Holding.js";

export const getPortfolio =
  async (req, res, next) => {
    try {
      const holdings =
        await Holding.find({
          userId: req.user._id,
        }).populate("stockId");

      let totalInvested = 0;
      let currentPortfolioValue = 0;

      const formattedHoldings =
        holdings.map((holding) => {
          const investedAmount =
            holding.quantity *
            holding.averagePurchasePrice;

          const currentValue =
            holding.quantity *
            holding.stockId.currentPrice;

          const profitLoss =
            currentValue -
            investedAmount;

          totalInvested +=
            investedAmount;

          currentPortfolioValue +=
            currentValue;

          return {
            id: holding._id,

            stockId:
              holding.stockId._id,

            companyName:
              holding.stockId.companyName,

            symbol:
              holding.stockId.symbol,

            quantity:
              holding.quantity,

            averagePurchasePrice:
              holding.averagePurchasePrice,

            currentPrice:
              holding.stockId.currentPrice,

            investedAmount,

            currentValue,

            profitLoss,
          };
        });

      const totalAccountValue =
        req.user.balance +
        currentPortfolioValue;

      const profitLoss =
        currentPortfolioValue -
        totalInvested;

      res.json({
        cash: req.user.balance,

        totalInvested,

        currentPortfolioValue,

        totalAccountValue,

        profitLoss,

        holdings:
          formattedHoldings,
      });
    } catch (error) {
      next(error);
    }
  };
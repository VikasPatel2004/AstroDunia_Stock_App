import Stock from "../models/Stock.js";

export const getStocks = async (
  req,
  res,
  next
) => {
  try {
    const search = (
      req.query.search || ""
    ).trim();

    let filter = {};

    if (search) {
      filter = {
        $or: [
          {
            companyName: {
              $regex: search,
              $options: "i",
            },
          },
          {
            symbol: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    }

    const stocks =
      await Stock.find(filter)
        .sort({
          companyName: 1,
        });

    res.json({
      stocks,
    });
  } catch (error) {
    next(error);
  }
};

export const getStock = async (
  req,
  res,
  next
) => {
  try {
    const stock =
      await Stock.findById(
        req.params.id
      );

    if (!stock) {
      return res.status(404).json({
        message: "Stock not found",
      });
    }

    res.json({
      stock,
    });
  } catch (error) {
    next(error);
  }
};
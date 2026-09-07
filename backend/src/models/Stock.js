import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
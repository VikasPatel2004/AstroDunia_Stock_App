import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    averagePurchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One user can have only one active holding for a stock
holdingSchema.index(
  {
    userId: 1,
    stockId: 1,
  },
  {
    unique: true,
  }
);

const Holding = mongoose.model("Holding", holdingSchema);

export default Holding;
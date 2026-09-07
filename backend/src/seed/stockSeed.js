import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "../models/Stock.js";

dotenv.config();

const stocks = [
  {
    companyName: "Reliance Industries",
    symbol: "RELIANCE",
    currentPrice: 2500,
  },

  {
    companyName:
      "Tata Consultancy Services",
    symbol: "TCS",
    currentPrice: 3400,
  },

  {
    companyName: "Infosys",
    symbol: "INFY",
    currentPrice: 1500,
  },

  {
    companyName: "HDFC Bank",
    symbol: "HDFCBANK",
    currentPrice: 1700,
  },

  {
    companyName: "ICICI Bank",
    symbol: "ICICIBANK",
    currentPrice: 1250,
  },

  {
    companyName:
      "State Bank of India",
    symbol: "SBIN",
    currentPrice: 800,
  },

  {
    companyName: "ITC",
    symbol: "ITC",
    currentPrice: 500,
  },

  {
    companyName: "Wipro",
    symbol: "WIPRO",
    currentPrice: 550,
  },

  {
    companyName: "Bharti Airtel",
    symbol: "BHARTIARTL",
    currentPrice: 1800,
  },

  {
    companyName:
      "Hindustan Unilever",
    symbol: "HINDUNILVR",
    currentPrice: 2600,
  },

  {
    companyName:
      "Larsen & Toubro",
    symbol: "LT",
    currentPrice: 3600,
  },

  {
    companyName: "Axis Bank",
    symbol: "AXISBANK",
    currentPrice: 1200,
  },
];

const seedStocks = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    await Stock.deleteMany({});

    await Stock.insertMany(stocks);

    console.log(
      `${stocks.length} stocks seeded successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Seed failed:",
      error.message
    );

    process.exit(1);
  }
};

seedStocks();
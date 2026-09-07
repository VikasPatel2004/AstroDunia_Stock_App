import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    balance: user.balance,
  };
};

// REGISTER
export const register = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "Email already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      balance: 100000,
    });

    const token = generateToken(
      user._id
    );

    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const login = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const user =
      await User.findOne({
        email: email
          .trim()
          .toLowerCase(),
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const token = generateToken(
      user._id
    );

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// CURRENT USER
export const getMe = async (
  req,
  res
) => {
  res.json({
    user: sanitizeUser(req.user),
  });
};
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/auth.js";

const generateToken = (id: string) => {
  return jwt.sign({ id }, config.JWT_SECRET as string, { expiresIn: "30d" });
};

// User registration
// POST /api/auth/register

export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please enter all required fields" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Login user
// POST /api/auth/login

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Get user profile
// GET /api/auth/me
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
    }
    res.json(req.user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

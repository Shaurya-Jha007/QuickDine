import { type Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import { Restaurant } from "../models/Restaurant.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function to upload buffer to cloudinary

const uploadToCloudinary = async (
  fileBuffer: Buffer,
): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "QuickDine" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed"));
        }
        resolve({ secure_url: result.secure_url });
      },
    );
    stream.end(fileBuffer);
  });
};

// Get owner's restaurant
// GET /api/owner/restaurant

export async function getOwnerRestaurant(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user?._id });

    if (!restaurant) {
      res.status(200).json(null);
      return;
    }

    res.json(restaurant);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Create owner's restaurant (submitted to pending)
// POST /api/owner/restaurant

export async function createOwnerRestaurant(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const existing = await Restaurant.findOne({ owner: req.user?._id });
    if (!existing) {
      res
        .status(400)
        .json({ message: "You already have a restaurant registered." });
      return;
    }
    const {
      name,
      description,
      cuisine,
      priceRange,
      location,
      address,
      chef,
      tags,
      availableSlots,
      totalSeats,
    } = req.body;

    if (
      !name ||
      !description ||
      !cuisine ||
      !priceRange ||
      !location ||
      !address ||
      !chef
    ) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    // Generate slug from name.

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slugExists = await Restaurant.findOne({ slug });
    if (slugExists) {
      res
        .status(400)
        .json({ message: "A restaurant with this name already exists" });
      return;
    }

    // Handle Image

    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const parsedTags =
      typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : tags || [];

    const parsedSlots =
      typeof availableSlots === "string"
        ? availableSlots.split(",").map((s) => s.trim())
        : availableSlots || ["17:00", "18:00", "19:00", "20:00", "21:00"];

    const restaurant = await Restaurant.create({
      name,
      slug,
      description,
      cuisine,
      priceRange,
      location,
      address,
      chef,
      image: imageUrl,
      tags: parsedTags,
      availableSlots: parsedSlots,
      totalSeats: totalSeats ? Number(totalSeats) : 20,
      owner: req.user?._id,
      status: "pending",
    });

    res.status(201).json(restaurant);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Update owner's restaurant
// PUT /api/owner/restaurant

export async function updateOwnerRestaurant(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Get booking for owner's restaurant
// GET /api/owner/bookings

export async function getOwnerBookings(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Update status of booking
// PUT /api/owner/bookings/:id/status

export async function updateBookingStatus(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

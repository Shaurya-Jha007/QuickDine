import type { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.js";

// Get all restaurants with search and filters.
// GET /api/restaurants
export async function getRestaurant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { search, priceRange, rating, location, sort } = req.query;

    const queryObj: any = { status: "approved" };

    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (priceRange) {
      const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
      queryObj.priceRange = { $in: prices };
    }

    if (rating) {
      queryObj.rating = { $gte: parseFloat(rating as string) };
    }

    if (location) {
      queryObj.location = { $regex: location as string, $options: "i" };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "price_low") {
      sortOption = { priceRange: 1 };
    } else if (sort === "price_high") {
      sortOption = { priceRange: -1 };
    }

    const restaurant = await Restaurant.find(queryObj).sort(sortOption);
    res.json(restaurant);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Get all featured and exclusive restaurants.
// GET /api/restaurants/featured
export async function getFeaturedRestaurant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Get single restaurant by slug
// GET /api/restaurants/:slug
export async function getRestaurantBySlug(
  req: Request,
  res: Response,
): Promise<void> {
  try {
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Get dynamic seat availability for slots
// GET /api/restaurants/:id/availability
export async function getRestaurantAvailability(
  req: Request,
  res: Response,
): Promise<void> {
  try {
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

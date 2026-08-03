import type { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { User } from "../models/User.model.js";

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
    const featured: any = await Restaurant.find({
      status: "approved",
      $or: [{ featured: true, exclusive: true }],
    }).limit(6);

    res.json(featured);
  } catch (err: any) {
    console.error("Get featured restaurants error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
}

// Get single restaurant by slug
// GET /api/restaurants/:slug
export async function getRestaurantBySlug(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    if (restaurant.status !== "approved") {
      let isAuthorized: boolean = false;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          const token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(token, config.JWT_SECRET as string) as {
            id: string;
          };
          const user = await User.findById(decoded.id);

          if (
            user &&
            (user.role === "admin" ||
              (user.role === "owner" &&
                restaurant.owner.toString() === user._id.toString()))
          ) {
            isAuthorized = true;
          }
        } catch (err) {
          // Ignore token verification error.
        }
      }
      if (!isAuthorized) {
        res
          .status(404)
          .json({ message: "Restaurant not found or pending approval" });
        return;
      }
    }
    res.json(restaurant);
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
    const { date } = req.query;
    if (!date) {
      res.status(400).json({ message: "Please provide a date" });
      return;
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(400).json({ message: "Restaurant not found" });
      return;
    }

    const bookingDate = new Date(date as string);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

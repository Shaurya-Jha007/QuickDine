import { Router } from "express";
import {
  getFeaturedRestaurant,
  getRestaurant,
  getRestaurantAvailability,
  getRestaurantBySlug,
} from "../controllers/restaurantController.js";

const restaurantRouter = Router();

restaurantRouter.get("/", getRestaurant);
restaurantRouter.get("/featured", getFeaturedRestaurant);
restaurantRouter.get("/:slug", getRestaurantBySlug);
restaurantRouter.get("/:id/availability", getRestaurantAvailability);

export default restaurantRouter;

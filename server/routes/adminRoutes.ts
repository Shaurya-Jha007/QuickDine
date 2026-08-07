import { Router } from "express";
import {
  approveRestaurant,
  getAdminStats,
  getAllRestaurants,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middlewares/auth.js";

const adminRoutes = Router();

adminRoutes.use(protect);
adminRoutes.use(adminOnly);

adminRoutes.get("/restaurants", getAllRestaurants);
adminRoutes.put("/restaurants/:id/approve", approveRestaurant);
adminRoutes.get("/stats", getAdminStats);

export default adminRoutes;

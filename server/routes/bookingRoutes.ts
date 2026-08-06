import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";

const bookingRoutes = Router();

bookingRoutes.post("/", protect, createBooking);

bookingRoutes.get("/my", protect, getMyBookings);

bookingRoutes.put("/:id/cancel", protect, cancelBooking);

export default bookingRoutes;

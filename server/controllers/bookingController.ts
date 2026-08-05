import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";

// Create a new booking
// POST /api/bookings
// @access private

export async function createBooking(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { date, time, guests, restaurantId, occasion, specialRequests } =
      req.body;

    if (!date || !time || !guests || !restaurantId) {
      res
        .status(400)
        .json({ message: "Please provide all required reservation details." });
      return;
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    if (restaurant.status !== "approved") {
      res
        .status(400)
        .json({ message: "Reservations are not open for this restaurant yet" });
      return;
    }

    const requestedGuests = Number(guests);

    const existingBookings = await Booking.find({
      restaurant: restaurantId,
      date: new Date(date),
      time,
      status: "confirmed",
    });

    const bookedSeats = existingBookings.reduce((sum, b) => sum + b.guests, 0);

    const totalSeats = restaurant.totalSeats || 20;

    const availableSeats = totalSeats - bookedSeats;

    if (requestedGuests > availableSeats) {
      res.status(400).json({
        message: `Unable to reserve. Only ${availableSeats} seats are available for this time slot`,
      });
      return;
    }

    const booking = await Booking.create({
      user: req.user?._id,
      restaurant: restaurantId,
      date: new Date(date),
      time,
      guests: requestedGuests,
      occasion,
      specialRequests,
      status: "confirmed",
    });

    const populatedBooking = await booking.populate(
      "restaurant",
      "name location image address",
    );

    res.status(201).json(populatedBooking);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Get logged in user bookings
// GET /api/bookings/my
// @access private

export async function getMyBookings(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const bookings = await Booking.find({
      user: req.user?._id,
    })
      .populate("restaurant", "name location image address slug")
      .sort({ date: -1, time: -1 });

    res.json(bookings);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Cancel a booking
// PUT /api/bookings/:id/cancel
// @access private

export async function cancelBooking(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    if (booking.user.toString() !== req.user?._id.toString()) {
      res
        .status(401)
        .json({ message: "Not authorized to cancel this booking" });
      return;
    }
    booking.status = "cancelled";
    await booking.save();

    const populatedBooking = await booking.populate(
      "restaurant",
      "name location image address",
    );

    res.json(populatedBooking);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import config from "./config/config.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const port = config.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is Live" });
});

app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error :", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
    stack: config.NODE_ENV === "production" ? undefined : err.stack,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

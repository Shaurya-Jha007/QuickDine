import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import config from "./config/config.js";

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is Live" });
});

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});

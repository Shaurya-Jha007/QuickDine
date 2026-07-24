import { config } from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

config();

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is Live" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

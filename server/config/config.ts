import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI not found in environment variables.");
}

if (!process.env.PORT) {
  throw new Error("PORT number not found in environment variables.");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not found in environment variables.");
}

interface AppConfig {
  MONGODB_URI: string;
  PORT: number;
  JWT_SECRET: string;
}

const config: AppConfig = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET,
} as const;

export default config;

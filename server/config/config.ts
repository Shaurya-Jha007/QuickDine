import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI not found in environment variables.");
}
if (!process.env.PORT) {
  throw new Error("PORT number not found in environment variables.");
}

const config: { MONGODB_URI: string; PORT: number } = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: Number(process.env.PORT),
} as const;

export default config;

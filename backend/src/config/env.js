import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5050),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4000",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
};

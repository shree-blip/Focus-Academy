import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db, sanitizeUser } from "../lib/store.js";
import { comparePassword, hashPassword, signToken } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { env } from "../config/env.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const googleSchema = z.object({
  idToken: z.string().min(10),
});

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  if (db.users.some((entry) => entry.email === normalizedEmail)) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const user = {
    id: uuidv4(),
    name,
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: "learner",
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);

  const token = signToken(user);
  return res.status(201).json({ token, user: sanitizeUser(user) });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  const { email, password } = parsed.data;
  const user = db.users.find((entry) => entry.email === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  return res.json({ token, user: sanitizeUser(user) });
});

authRouter.post("/google", async (req, res) => {
  const parsed = googleSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  if (!env.googleClientId) {
    return res.status(400).json({ message: "Google login is not configured on server" });
  }

  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(parsed.data.idToken)}`
    );

    if (!response.ok) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const profile = await response.json();

    if (profile.aud !== env.googleClientId) {
      return res.status(401).json({ message: "Google token audience mismatch" });
    }

    const email = String(profile.email || "").toLowerCase();
    if (!email) {
      return res.status(401).json({ message: "Google account email missing" });
    }

    let user = db.users.find((entry) => entry.email === email);

    if (!user) {
      user = {
        id: uuidv4(),
        name: profile.name || email.split("@")[0],
        email,
        passwordHash: await hashPassword(uuidv4()),
        role: "learner",
        provider: "google",
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    }

    const token = signToken(user);
    return res.json({ token, user: sanitizeUser(user) });
  } catch {
    return res.status(500).json({ message: "Google verification failed" });
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

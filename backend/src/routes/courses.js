import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "../lib/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const createCourseSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["virtual", "physical"]),
  price: z.number().nonnegative(),
  currency: z.string().default("USD"),
  capacity: z.number().int().positive().nullable().optional(),
});

const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  price: z.number().nonnegative().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  capacity: z.number().int().positive().nullable().optional(),
});

export const coursesRouter = Router();

coursesRouter.get("/catalog", (req, res) => {
  const { type } = req.query;

  const items = db.courses.filter((course) => {
    const typeMatches = type ? course.type === type : true;
    return course.status === "published" && typeMatches;
  });

  return res.json({ courses: items });
});

coursesRouter.get("/courses", requireAuth, requireRole("admin"), (req, res) => {
  return res.json({ courses: db.courses });
});

coursesRouter.post("/courses", requireAuth, requireRole("admin"), (req, res) => {
  const parsed = createCourseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  const { title, type, price, currency, capacity } = parsed.data;
  const normalizedCapacity = type === "physical" ? capacity ?? 30 : null;

  const course = {
    id: uuidv4(),
    title,
    type,
    price,
    currency,
    capacity: normalizedCapacity,
    seatsUsed: 0,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  db.courses.push(course);
  return res.status(201).json({ course });
});

coursesRouter.patch("/courses/:courseId", requireAuth, requireRole("admin"), (req, res) => {
  const parsed = updateCourseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  const course = db.courses.find((entry) => entry.id === req.params.courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  Object.assign(course, parsed.data, { updatedAt: new Date().toISOString() });
  return res.json({ course });
});

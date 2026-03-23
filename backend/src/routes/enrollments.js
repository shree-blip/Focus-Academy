import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "../lib/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { emitEnrollmentUpdated } from "../realtime/socket.js";

const createEnrollmentSchema = z.object({
  courseId: z.string().min(1),
});

export const enrollmentsRouter = Router();

enrollmentsRouter.post("/enrollments", requireAuth, requireRole("learner", "admin"), (req, res) => {
  const parsed = createEnrollmentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  const { courseId } = parsed.data;
  const course = db.courses.find((entry) => entry.id === courseId && entry.status === "published");

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  if (course.type === "physical" && course.capacity !== null && course.seatsUsed >= course.capacity) {
    return res.status(409).json({ message: "No seats available" });
  }

  const existing = db.enrollments.find(
    (entry) => entry.courseId === courseId && entry.userId === req.user.id && entry.status !== "cancelled"
  );

  if (existing) {
    return res.status(409).json({ message: "Enrollment already exists", enrollment: existing });
  }

  const enrollment = {
    id: uuidv4(),
    userId: req.user.id,
    courseId,
    status: "pending_payment",
    accessStatus: "inactive",
    createdAt: new Date().toISOString(),
  };

  db.enrollments.push(enrollment);
  emitEnrollmentUpdated(enrollment);

  return res.status(201).json({ enrollment });
});

enrollmentsRouter.get("/enrollments/me", requireAuth, (req, res) => {
  const enrollments = db.enrollments.filter((entry) => entry.userId === req.user.id);
  return res.json({ enrollments });
});

enrollmentsRouter.get("/admin/enrollments", requireAuth, requireRole("admin"), (req, res) => {
  return res.json({ enrollments: db.enrollments });
});

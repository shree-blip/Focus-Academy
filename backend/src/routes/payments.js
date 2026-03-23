import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "../lib/store.js";
import { requireAuth } from "../middleware/auth.js";
import { emitEnrollmentUpdated, emitPaymentUpdated } from "../realtime/socket.js";

const checkoutSchema = z.object({
  enrollmentId: z.string().min(1),
  method: z.enum(["mock-esewa", "mock-khalti"]),
});

const callbackSchema = z.object({
  paymentId: z.string().min(1),
  status: z.enum(["success", "failed"]),
});

export const paymentsRouter = Router();

paymentsRouter.post("/payments/checkout", requireAuth, (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  const { enrollmentId, method } = parsed.data;
  const enrollment = db.enrollments.find((entry) => entry.id === enrollmentId);

  if (!enrollment || enrollment.userId !== req.user.id) {
    return res.status(404).json({ message: "Enrollment not found" });
  }

  const course = db.courses.find((entry) => entry.id === enrollment.courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const payment = {
    id: uuidv4(),
    userId: req.user.id,
    enrollmentId,
    courseId: course.id,
    amount: course.price,
    currency: course.currency,
    provider: method,
    status: "initiated",
    createdAt: new Date().toISOString(),
  };

  db.payments.push(payment);
  emitPaymentUpdated(payment);

  return res.status(201).json({
    payment,
    next: {
      mockCallbackEndpoint: "/api/payments/mock-callback",
      instruction: "POST paymentId + status=success|failed",
    },
  });
});

paymentsRouter.post("/payments/mock-callback", (req, res) => {
  const parsed = callbackSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues });
  }

  const { paymentId, status } = parsed.data;
  const payment = db.payments.find((entry) => entry.id === paymentId);

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  if (payment.status === "success") {
    return res.status(200).json({ payment, message: "Already processed" });
  }

  payment.status = status;
  payment.updatedAt = new Date().toISOString();

  const enrollment = db.enrollments.find((entry) => entry.id === payment.enrollmentId);

  if (enrollment) {
    const course = db.courses.find((entry) => entry.id === enrollment.courseId);

    if (status === "success") {
      enrollment.status = "paid";
      enrollment.accessStatus = "active";
      enrollment.paidAt = new Date().toISOString();

      if (course?.type === "physical" && course.capacity !== null) {
        course.seatsUsed += 1;
      }
    } else {
      enrollment.status = "payment_failed";
      enrollment.accessStatus = "inactive";
    }

    emitEnrollmentUpdated(enrollment);
  }

  emitPaymentUpdated(payment);

  return res.json({ payment, enrollment });
});

paymentsRouter.get("/payments/me", requireAuth, (req, res) => {
  const payments = db.payments.filter((entry) => entry.userId === req.user.id);
  return res.json({ payments });
});

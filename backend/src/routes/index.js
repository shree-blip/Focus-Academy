import { Router } from "express";
import { authRouter } from "./auth.js";
import { coursesRouter } from "./courses.js";
import { enrollmentsRouter } from "./enrollments.js";
import { paymentsRouter } from "./payments.js";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.json({ ok: true, service: "focus-academy-backend", ts: new Date().toISOString() });
});

apiRouter.use("/auth", authRouter);
apiRouter.use(coursesRouter);
apiRouter.use(enrollmentsRouter);
apiRouter.use(paymentsRouter);

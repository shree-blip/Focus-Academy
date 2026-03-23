import http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { attachSocket } from "./realtime/socket.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({
    service: "Focus Academy Backend",
    mode: "mock-payments",
    docs: "/api/health",
    demoUsers: {
      admin: { email: "admin@focusacademy.test", password: "Admin@123" },
      learner: { email: "user@focusacademy.test", password: "User@123" },
    },
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.corsOrigin,
    credentials: true,
  },
});

attachSocket(io);

server.listen(env.port, () => {
  console.log(`Focus Academy backend running on http://localhost:${env.port}`);
});

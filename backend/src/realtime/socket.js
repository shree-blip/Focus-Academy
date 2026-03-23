let ioRef = null;

export function attachSocket(io) {
  ioRef = io;

  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on("join:admin", () => {
      socket.join("admin");
    });
  });
}

export function emitEnrollmentUpdated(enrollment) {
  if (!ioRef) return;

  ioRef.to(`user:${enrollment.userId}`).emit("enrollment.updated", enrollment);
  ioRef.to("admin").emit("admin.enrollment.updated", enrollment);
}

export function emitPaymentUpdated(payment) {
  if (!ioRef) return;

  ioRef.to(`user:${payment.userId}`).emit("payment.updated", payment);
  ioRef.to("admin").emit("admin.payment.updated", payment);
}

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const auth = window.FocusAuth;
    if (!auth) return;

    async function ensureLoggedIn() {
      const state = auth.getAuth();
      if (state.token && state.user) return state.user;
      window.location.href = "/dashboard/";
      return null;
    }

    async function findCatalogCourseByTitle(title) {
      const data = await auth.request("/api/catalog");
      return data.courses.find((entry) => entry.title.toLowerCase() === String(title).toLowerCase());
    }

    async function bookClass(button) {
      const classType = button.dataset.classType;
      const courseTitle = button.dataset.courseTitle;

      const user = await ensureLoggedIn();
      if (!user) return;

      button.disabled = true;
      const original = button.textContent;
      button.textContent = "Booking...";

      try {
        const course = await findCatalogCourseByTitle(courseTitle);
        if (!course) {
          throw new Error("Course not available in live catalog yet.");
        }

        const enrollmentRes = await auth.request("/api/enrollments", {
          method: "POST",
          body: JSON.stringify({ courseId: course.id }),
        });

        const method = classType === "physical" ? "mock-khalti" : "mock-esewa";
        const paymentRes = await auth.request("/api/payments/checkout", {
          method: "POST",
          body: JSON.stringify({
            enrollmentId: enrollmentRes.enrollment.id,
            method,
          }),
        });

        await auth.request("/api/payments/mock-callback", {
          method: "POST",
          body: JSON.stringify({ paymentId: paymentRes.payment.id, status: "success" }),
        });

        button.textContent = "Booked ✓";
      } catch (error) {
        button.disabled = false;
        button.textContent = original;
        alert(error.message);
      }
    }

    document.querySelectorAll(".book-class-btn").forEach((button) => {
      button.addEventListener("click", () => bookClass(button));
    });
  });
})();

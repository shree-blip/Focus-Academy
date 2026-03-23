(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const auth = window.FocusAuth;
    if (!auth) return;

    const authShell = document.getElementById("auth-shell");
    const dashboardShell = document.getElementById("admin-dashboard-shell");
    const coursesEl = document.getElementById("admin-courses");
    const enrollmentsEl = document.getElementById("admin-enrollments");
    const createForm = document.getElementById("create-course-form");
    const createMsg = document.getElementById("course-create-msg");

    async function loadData() {
      const [coursesData, enrollmentsData] = await Promise.all([
        auth.request("/api/courses"),
        auth.request("/api/admin/enrollments"),
      ]);

      coursesEl.innerHTML = coursesData.courses.length
        ? `<ul>${coursesData.courses
            .map(
              (entry) => `<li><strong>${entry.title}</strong> · ${entry.type} · ${entry.status} · ${entry.price} ${entry.currency}</li>`
            )
            .join("")}</ul>`
        : "<p class='app-muted'>No courses available.</p>";

      enrollmentsEl.innerHTML = enrollmentsData.enrollments.length
        ? `<ul>${enrollmentsData.enrollments
            .map(
              (entry) => `<li><strong>${entry.status}</strong> · user=${entry.userId} · course=${entry.courseId}</li>`
            )
            .join("")}</ul>`
        : "<p class='app-muted'>No enrollments yet.</p>";
    }

    function onAuthed(user) {
      if (user.role !== "admin") {
        authShell.innerHTML = "<p class='text-danger'>Admin access only.</p>";
        return;
      }
      authShell.style.display = "none";
      dashboardShell.style.display = "block";
      dashboardShell.querySelector("h2").textContent = `Operations · ${user.name}`;
      loadData().catch((error) => {
        coursesEl.innerHTML = `<p class='text-danger'>${error.message}</p>`;
      });

      createForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = new FormData(createForm);
        const type = form.get("type");
        const payload = {
          title: form.get("title"),
          type,
          price: Number(form.get("price")),
          currency: "USD",
        };

        if (type === "physical" && form.get("capacity")) {
          payload.capacity = Number(form.get("capacity"));
        }

        try {
          await auth.request("/api/courses", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          createMsg.textContent = "Course created as draft. Use API to publish if needed.";
          createForm.reset();
          await loadData();
        } catch (error) {
          createMsg.textContent = error.message;
        }
      });
    }

    auth.authUI(authShell, onAuthed);

    document.getElementById("logout-btn")?.addEventListener("click", () => {
      auth.clearAuth();
      location.reload();
    });
  });
})();

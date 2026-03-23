(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const auth = window.FocusAuth;
    if (!auth) return;

    const authShell = document.getElementById("auth-shell");
    const dashboardShell = document.getElementById("user-dashboard-shell");
    const enrollmentsEl = document.getElementById("my-enrollments");
    const paymentsEl = document.getElementById("my-payments");
    let courseIndex = {};

    async function loadData() {
      const [catalogData, enrollmentsData, paymentsData] = await Promise.all([
        auth.request("/api/catalog"),
        auth.request("/api/enrollments/me"),
        auth.request("/api/payments/me"),
      ]);

      courseIndex = Object.fromEntries((catalogData.courses || []).map((entry) => [entry.id, entry]));

      enrollmentsEl.innerHTML = enrollmentsData.enrollments.length
        ? `<ul>${enrollmentsData.enrollments
            .map(
              (entry) => `<li><strong>${entry.status}</strong> · Access: ${entry.accessStatus} · Course: ${courseIndex[entry.courseId]?.title || entry.courseId}</li>`
            )
            .join("")}</ul>`
        : "<p class='app-muted'>No enrollments yet.</p>";

      paymentsEl.innerHTML = paymentsData.payments.length
        ? `<ul>${paymentsData.payments
            .map(
              (entry) => `<li><strong>${entry.status}</strong> · ${entry.provider} · ${entry.amount} ${entry.currency}</li>`
            )
            .join("")}</ul>`
        : "<p class='app-muted'>No payments yet.</p>";
    }

    function onAuthed(user) {
      authShell.style.display = "none";
      dashboardShell.style.display = "block";
      dashboardShell.querySelector("h2").textContent = `My Learning · ${user.name}`;
      loadData().catch((error) => {
        enrollmentsEl.innerHTML = `<p class='text-danger'>${error.message}</p>`;
      });
    }

    auth.authUI(authShell, onAuthed);

    document.getElementById("logout-btn")?.addEventListener("click", () => {
      auth.clearAuth();
      location.reload();
    });
  });
})();

(function () {
  const appRoot = document.querySelector(".app-shell");
  const authShell = document.getElementById("auth-shell");
  const firstNonEmpty = (...values) => values.find((value) => typeof value === "string" && value.trim() !== "") || "";
  const apiBaseFromPage = firstNonEmpty(authShell?.dataset?.apiBase, appRoot?.dataset?.apiBase);
  const googleClientIdFromPage = firstNonEmpty(authShell?.dataset?.googleClientId, appRoot?.dataset?.googleClientId);
  const API_BASE = (window.FOCUS_API_BASE || apiBaseFromPage || "http://localhost:5050").replace(/\/$/, "");
  const GOOGLE_CLIENT_ID = googleClientIdFromPage;

  function resolvePostAuthRoute(user) {
    const role = String(user?.role || "").toLowerCase();
    return role === "admin" || role === "superadmin" ? "/admin/" : "/dashboard/";
  }

  function getSelectedPlanFromUrl() {
    const params = new URLSearchParams(window.location.search || "");
    const plan = String(params.get("plan") || "").toLowerCase();
    return plan === "physical" || plan === "online" ? plan : null;
  }

  function getPlanMeta(plan) {
    if (plan === "physical") {
      return {
        title: "US Tax Training (Physical Class)",
        price: "NPR 20,000 + VAT",
      };
    }

    if (plan === "online") {
      return {
        title: "US Tax Training (Online Pre-recorded Class)",
        price: "NPR 10,000",
      };
    }

    return null;
  }

  function getAuth() {
    const token = localStorage.getItem("focus_token");
    const user = localStorage.getItem("focus_user");
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  }

  function setAuth(token, user) {
    localStorage.setItem("focus_token", token);
    localStorage.setItem("focus_user", JSON.stringify(user));
  }

  function clearAuth() {
    localStorage.removeItem("focus_token");
    localStorage.removeItem("focus_user");
  }

  async function request(path, options = {}) {
    const { token } = getAuth();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
      });
    } catch (error) {
      throw new Error(`Unable to connect to backend at ${API_BASE}. Please check server status and CORS settings.`);
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || "Request failed");
    }

    return payload;
  }

  function authUI(container, onAuthed = () => {}) {
    if (!container) return;

    const { token, user } = getAuth();
    if (token && user) {
      onAuthed(user);
      return;
    }

    const pageMode = container?.dataset?.page || "both"; // both, login, signup

    const showBoth = pageMode === "both";
    const showLoginOnly = pageMode === "login";
    const showSignupOnly = pageMode === "signup";
    const selectedPlan = getSelectedPlanFromUrl();
    const selectedPlanMeta = getPlanMeta(selectedPlan);

    let formHTML = `
      <p id="auth-error" class="text-danger mb-3" style="display:none;"></p>
    `;

    if (showBoth || showLoginOnly) {
      formHTML += `
        <div class="app-card ${showLoginOnly ? 'w-100' : ''}">
          <h3>Login</h3>
          <form id="login-form">
            <input class="form-control mb-2" type="email" name="email" placeholder="Email" required>
            <div class="auth-password-group input-group mb-2">
              <input id="login-password" class="form-control" type="password" name="password" placeholder="Password" required>
              <div class="input-group-append">
                <button class="btn btn-outline-secondary password-toggle" type="button" data-target="login-password" aria-label="Show password">
                  <i class="fas fa-eye" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-primary btn-sm btn-block" type="submit">Sign In</button>
          </form>
          <small class="app-muted d-block mt-2">Demo: user@focusacademy.test / User@123</small>
        </div>
      `;
    }

    if (showBoth || showSignupOnly) {
      formHTML += `
        <div class="app-card ${showSignupOnly ? 'w-100' : ''}">
          <h3>${showSignupOnly ? 'Create Your Account' : 'Sign Up'}</h3>
          <form id="signup-form">
            <input class="form-control mb-2" type="text" name="name" placeholder="Full Name" required>
            <input class="form-control mb-2" type="email" name="email" placeholder="Email" required>
            <div class="auth-password-group input-group mb-2">
              <input id="signup-password" class="form-control" type="password" name="password" placeholder="Password (min 8 chars)" required>
              <div class="input-group-append">
                <button class="btn btn-outline-secondary password-toggle" type="button" data-target="signup-password" aria-label="Show password">
                  <i class="fas fa-eye" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-primary btn-sm btn-block" type="submit">Create Account</button>
          </form>
          <div id="google-auth-wrap" class="mt-3 text-center"></div>
        </div>
      `;
    }

    const layoutClass = showBoth ? "app-auth-grid" : "app-auth-single";
    container.innerHTML = `<div class="${layoutClass}">${formHTML}</div>`;

    const enrollmentSummary = document.getElementById("enrollment-summary");
    if (enrollmentSummary) {
      if (selectedPlanMeta) {
        enrollmentSummary.innerHTML = `<div class="alert alert-info mb-0"><strong>Selected:</strong> ${selectedPlanMeta.title} — ${selectedPlanMeta.price}</div>`;
      } else if (showSignupOnly) {
        enrollmentSummary.innerHTML = `<div class="alert alert-light mb-0"><strong>Tip:</strong> You can choose your preferred class format from the pricing section.</div>`;
      } else {
        enrollmentSummary.innerHTML = "";
      }
    }

    const showError = (message) => {
      const error = container.querySelector("#auth-error");
      if (!error) return;

      const finalMessage = /failed to fetch/i.test(String(message || ""))
        ? `Unable to connect to backend at ${API_BASE}. Please start the API server and verify CORS_ORIGIN.`
        : message;

      error.style.display = "block";
      error.textContent = finalMessage;
    };

    container.querySelectorAll(".password-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        const input = targetId ? container.querySelector(`#${targetId}`) : null;
        if (!input) return;

        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";

        const icon = button.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-eye", !isHidden);
          icon.classList.toggle("fa-eye-slash", isHidden);
        }

        button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      });
    });

    container.querySelector("#login-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      try {
        const data = await request("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
          }),
        });
        setAuth(data.token, data.user);
        onAuthed(data.user);
      } catch (error) {
        showError(error.message);
      }
    });

    container.querySelector("#signup-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      try {
        const data = await request("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            password: form.get("password"),
            plan: selectedPlan || undefined,
          }),
        });
        setAuth(data.token, data.user);
        onAuthed(data.user);
      } catch (error) {
        showError(error.message);
      }
    });

    if (window.google?.accounts?.id && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const data = await request("/api/auth/google", {
              method: "POST",
              body: JSON.stringify({ idToken: response.credential }),
            });
            setAuth(data.token, data.user);
            onAuthed(data.user);
          } catch (error) {
            showError(error.message);
          }
        },
      });

      window.google.accounts.id.renderButton(container.querySelector("#google-auth-wrap"), {
        theme: "outline",
        size: "large",
        text: "continue_with",
      });
    } else {
      const target = container.querySelector("#google-auth-wrap");
      if (target) {
        target.innerHTML = "<small class='app-muted'>Add google_oauth_client_id in config to enable Google login.</small>";
      }
    }
  }

  window.FocusAuth = {
    API_BASE,
    request,
    getAuth,
    setAuth,
    clearAuth,
    resolvePostAuthRoute,
    authUI,
  };

  const hasUserDashboardShell = !!document.querySelector("#user-dashboard-shell");
  const hasAdminDashboardShell = !!document.querySelector("#admin-dashboard-shell");
  const isStandaloneAuthPage = !!authShell && !hasUserDashboardShell && !hasAdminDashboardShell;

  if (isStandaloneAuthPage) {
    authUI(authShell, (user) => {
      window.location.assign(resolvePostAuthRoute(user));
    });
  }
})();

(function () {
  const appRoot = document.querySelector(".app-shell");
  const apiBaseFromPage = appRoot?.dataset?.apiBase || "";
  const API_BASE = (window.FOCUS_API_BASE || apiBaseFromPage || "http://localhost:5050").replace(/\/$/, "");
  const GOOGLE_CLIENT_ID = appRoot?.dataset?.googleClientId || "";

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

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || "Request failed");
    }

    return payload;
  }

  function authUI(container, onAuthed) {
    if (!container) return;

    const { token, user } = getAuth();
    if (token && user) {
      onAuthed(user);
      return;
    }

    container.innerHTML = `
      <div class="app-auth-grid">
        <div class="app-card">
          <h3>Login</h3>
          <form id="login-form">
            <input class="form-control mb-2" type="email" name="email" placeholder="Email" required>
            <input class="form-control mb-2" type="password" name="password" placeholder="Password" required>
            <button class="btn btn-primary btn-sm" type="submit">Login</button>
          </form>
          <small class="app-muted">Demo: user@focusacademy.test / User@123</small>
        </div>
        <div class="app-card">
          <h3>Sign Up</h3>
          <form id="signup-form">
            <input class="form-control mb-2" type="text" name="name" placeholder="Full Name" required>
            <input class="form-control mb-2" type="email" name="email" placeholder="Email" required>
            <input class="form-control mb-2" type="password" name="password" placeholder="Password (min 8 chars)" required>
            <button class="btn btn-primary btn-sm" type="submit">Create Account</button>
          </form>
          <div id="google-auth-wrap" class="mt-2"></div>
        </div>
      </div>
      <p id="auth-error" class="text-danger mt-2" style="display:none;"></p>
    `;

    const showError = (message) => {
      const error = container.querySelector("#auth-error");
      if (!error) return;
      error.style.display = "block";
      error.textContent = message;
    };

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
        size: "medium",
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
    authUI,
  };
})();

---
layout: page
permalink: /login/
title: Sign In
description: Sign in to Focus Academy to access your courses and learning dashboard
nav: true
nav_order: 3
google_auth: true
custom_js:
  - app-auth
---

<section class="auth-page">
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Sign In to Focus Academy</h1>
        <p>Access your courses, enrollments, and learning progress</p>
      </div>

      <div id="auth-shell" class="auth-form" data-api-base="{{ site.api_base_url }}" data-google-client-id="{{ site.google_oauth_client_id }}" data-page="login"></div>

      <div class="auth-footer">
        <p>Don't have an account? <a href="/signup/">Create one here</a></p>
      </div>
    </div>
  </div>
</section>

<style>
.auth-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  padding: 40px;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.auth-header p {
  color: #666;
  font-size: 14px;
}

.auth-form {
  margin: 25px 0;
}

.auth-footer {
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-top: 25px;
  font-size: 14px;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-page {
    padding: 20px 10px;
  }
  
  .auth-card {
    padding: 25px;
  }
}
</style>

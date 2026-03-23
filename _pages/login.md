---
layout: page
permalink: /login/
title: Sign In
description: Sign in to Focus Academy to access your courses and learning dashboard
nav: false
nav_order: 3
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

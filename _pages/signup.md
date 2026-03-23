---
layout: page
permalink: /signup/
title: Create Account
description: Register for Focus Academy to begin your tax training journey
nav: false
nav_order: 4
custom_js:
  - app-auth
---

<section class="auth-page">
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Create Your Account</h1>
        <p>Get started with Focus Academy tax training programs</p>
      </div>

      <div id="auth-shell" class="auth-form" data-api-base="{{ site.api_base_url }}" data-google-client-id="{{ site.google_oauth_client_id }}" data-page="signup"></div>

      <div class="auth-footer">
        <p>Already have an account? <a href="/login/">Sign in here</a></p>
      </div>
    </div>
  </div>
</section>

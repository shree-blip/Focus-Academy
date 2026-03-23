---
layout: page
permalink: /dashboard/
title: dashboard
description: learner dashboard preview for Focus Academy
nav: true
nav_order: 8
google_auth: true
custom_js:
	- app-auth
	- user-dashboard-app
---

<section class="app-shell" data-api-base="{{ site.api_base_url }}" data-google-client-id="{{ site.google_oauth_client_id }}">
	<h1>Learner Dashboard</h1>
	<p class="app-lead">Sign in to manage enrollments, payments, and access status in real time.</p>

	<div id="auth-shell" class="app-panel"></div>

	<div id="user-dashboard-shell" class="app-panel" style="display:none;">
		<div class="app-toolbar">
			<h2>My Learning</h2>
			<button id="logout-btn" class="btn btn-outline-secondary btn-sm">Logout</button>
		</div>

		<div class="app-grid">
			<div class="app-card">
				<h3>My Enrollments</h3>
				<div id="my-enrollments"></div>
			</div>
			<div class="app-card">
				<h3>My Payments</h3>
				<div id="my-payments"></div>
			</div>
		</div>
	</div>
</section>

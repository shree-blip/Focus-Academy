---
layout: page
permalink: /admin/
title: admin
description: admin dashboard preview for Focus Academy
nav: false
custom_js:
  - app-auth
  - admin-dashboard-app
---

<section class="app-shell" data-api-base="{{ site.api_base_url }}" data-google-client-id="{{ site.google_oauth_client_id }}">
	<h1>Admin Dashboard</h1>
	<p class="app-lead">Manage virtual/physical classes, enrollments, and payments from one place.</p>

	<div id="auth-shell" class="app-panel"></div>

	<div id="admin-dashboard-shell" class="app-panel" style="display:none;">
		<div class="app-toolbar">
			<h2>Operations</h2>
			<button id="logout-btn" class="btn btn-outline-secondary btn-sm">Logout</button>
		</div>

		<div class="app-card mb-3">
			<h3>Create Course</h3>
			<form id="create-course-form" class="app-auth-grid">
				<input class="form-control" type="text" name="title" placeholder="Course title" required>
				<select class="form-control" name="type" required>
					<option value="virtual">Virtual</option>
					<option value="physical">Physical</option>
				</select>
				<input class="form-control" type="number" min="0" name="price" placeholder="Price" required>
				<input class="form-control" type="number" min="1" name="capacity" placeholder="Capacity (physical only)">
				<button class="btn btn-primary btn-sm" type="submit">Create</button>
			</form>
			<p id="course-create-msg" class="app-muted mt-2"></p>
		</div>

		<div class="app-grid">
			<div class="app-card">
				<h3>Courses</h3>
				<div id="admin-courses"></div>
			</div>
			<div class="app-card">
				<h3>Enrollments</h3>
				<div id="admin-enrollments"></div>
			</div>
		</div>
	</div>
</section>

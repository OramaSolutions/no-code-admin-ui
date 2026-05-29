# Application Registry Admin Frontend Guide

This document explains the current admin-facing Application Registry APIs, how the frontend should use them, and the expected admin panel flow.

## Base Path

All registry routes are mounted under:

`/api/v1/registry`

So the full admin routes are:

- `GET /admin/stats`
- `GET /admin/applications`
- `GET /admin/applications/:id`
- `PATCH /admin/applications/:id`
- `PATCH /admin/versions/:version_id`
- `PATCH /admin/components/:comp_id/activate`
- `PATCH /admin/components/:comp_id/rollback`
- `PATCH /admin/components/:comp_id/activate-next`

## Auth

Admin routes are protected by `verifyAdminToken`.

Frontend requirements:

- admin session must include the `admin_access_token` cookie
- requests should be sent with credentials enabled
- if the cookie is missing or invalid, backend returns `401`

Typical frontend fetch/axios setup:

```js
fetch(".../admin/stats", {
  method: "GET",
  credentials: "include",
});
```

## Registry Data Model

The frontend should think about the data in 4 layers:

### 1. Application

Top-level product record.

Important fields:

- `_id`
- `application_name`
- `display_name`
- `status`: `inactive | active | archived`
- `total_downloads`
- `admin_notes`
- `metadata.description`
- `metadata.tags`
- `metadata.thumbnail_url`
- `metadata.docs_url`
- `created_at`
- `updated_at`

### 2. Component

Each application can have separate components:

- `backend`
- `ui`

Important fields:

- `_id`
- `application_id`
- `component_name`
- `component_type`
- `active_version_id`

### 3. Version

Each component can have many versions.

Important fields:

- `_id`
- `component_id`
- `version_tag`
- `version_description`
- `build_status`: `success | failed`
- `download_count`
- `failure_stage`
- `failure_reason`
- `failed_at`
- `storage.docker_image`
- `storage.artifact_path`
- `storage.docker_cmd`
- `created_at`

### 4. System Stats

Dashboard summary record.

Important fields:

- `total_applications`
- `active_applications`
- `total_builds_count`
- `failed_builds_count`
- `total_downloads_all_time`
- `total_storage_used_bytes`
- `last_updated`

## What Admin Can Do

The admin panel currently supports these actions:

- view registry stats
- load the application list
- load one application detail view with backend/UI version history
- update application display settings and status
- update a version tag or version description
- activate any successful version for a component
- roll a component back to the previous successful version
- move a component forward to the next successful version

Important behavior:

- activation is per component, not per application
- backend and UI are controlled independently
- failed versions cannot be made active
- if a failed build is retried later with the same `version_tag`, the backend upgrades that same version record to `success`

## Admin Routes

### 1. Get Dashboard Stats

`GET /admin/stats`

Use this for the top stats cards on the registry dashboard.

Frontend usage:

- call on registry dashboard load
- optionally refresh after any admin mutation

### 2. Get Admin Applications List

`GET /admin/applications`

Use this for the registry table/list screen.

What it returns for each application:

- application fields
- `components.backend` summary if present
- `components.ui` summary if present
- active version summary for backend if present
- active version summary for UI if present

Recommended UI usage:

- applications table
- registry overview cards
- entry point to detail page

### 3. Get Admin Application Detail

`GET /admin/applications/:id`

Path params:

- `id`: application `_id`

What it returns:

- full application record
- `components.backend`
- `components.ui`
- each component's `active_version`
- full `versions` array for backend
- full `versions` array for UI

Recommended UI usage:

- application detail page
- backend version history table
- UI version history table
- component action controls

### 4. Update Application Metadata and Status

`PATCH /admin/applications/:id`

Path params:

- `id`: application `_id`

Allowed payload fields:

```json
{
  "display_name": "Assembly Verification",
  "overall_description": "Checks the production assembly flow.",
  "status": "active"
}
```

Notes:

- all fields are optional
- `overall_description` maps to `metadata.description`
- valid `status` values are `inactive`, `active`, `archived`

### 5. Update Version Tag or Version Description

`PATCH /admin/versions/:version_id`

Path params:

- `version_id`: version `_id`

Allowed payload fields:

```json
{
  "version_tag": "v4",
  "version_description": "Fixed camera latency and improved API auth."
}
```

Rules:

- at least one of `version_tag` or `version_description` must be provided
- `version_tag` must remain unique inside the same component
- the same `version_tag` may exist in another component

### 6. Activate Any Successful Version

`PATCH /admin/components/:comp_id/activate`

Path params:

- `comp_id`: component `_id`

Payload:

```json
{
  "version_id": "68231c3d7f1c9d8a7e8f1234"
}
```

Rules:

- version must belong to that component
- version must have `build_status = success`
- this is the direct "choose this exact version" action

### 7. Roll Back to Previous Successful Version

`PATCH /admin/components/:comp_id/rollback`

Path params:

- `comp_id`: component `_id`

Payload:

- no body required

Rules:

- backend looks at successful versions only
- it moves `active_version_id` to the previous successful version by creation order
- if there is no earlier successful version, backend returns conflict

### 8. Move to Next Successful Version

`PATCH /admin/components/:comp_id/activate-next`

Path params:

- `comp_id`: component `_id`

Payload:

- no body required

Rules:

- backend looks at successful versions only
- it moves `active_version_id` to the next successful version by creation order
- if there is no later successful version, backend returns conflict

## Recommended Admin UI Structure

### Dashboard Page

Show:

- total applications
- active applications
- total builds
- failed builds
- total downloads

Call:

- `GET /admin/stats`

### Application List Page

Call:

- `GET /admin/applications`

Each row/card should show:

- application display name
- application technical name
- status
- total downloads
- backend active version
- UI active version

Actions:

- open application detail page
- quick status badge

### Application Detail Page

Call:

- `GET /admin/applications/:id`

Recommended sections:

- application settings
- backend component card
- UI component card
- version history for backend
- version history for UI

Application settings form should support:

- `display_name`
- `overall_description`
- `status`

Component card should show:

- component name
- active version
- active build artifact path
- available successful versions

Component actions should support:

- activate exact version
- rollback
- activate next

Version list should show:

- version tag
- build status
- version description
- created time
- download count
- failure stage and reason for failed builds
- action buttons

Version row actions:

- edit version tag
- edit version description
- make active, only if build is successful

## Suggested Frontend Action Flow

### Flow A. Registry Dashboard Load

1. Call `GET /admin/stats`.
2. Call `GET /admin/applications`.
3. Render the overview cards and application list.

### Flow B. Application Detail Load

1. Admin opens one application.
2. Frontend calls `GET /admin/applications/:id`.
3. Render application settings, backend component, UI component, and version tables.

### Flow C. Publish a Newly Built Version

1. Frontend refreshes application detail data.
2. Admin sees a new version row with `build_status = success`.
3. Admin can either:
   - click `Make Active` for a specific version
   - click `Activate Next` on the component
4. Frontend calls the matching component route.
5. Frontend refreshes the application detail screen.

### Flow D. Roll Back a Broken Active Version

1. Admin opens application detail.
2. Admin chooses the affected component: `backend` or `ui`.
3. Admin clicks `Rollback`.
4. Frontend calls `PATCH /admin/components/:comp_id/rollback`.
5. Frontend refreshes the application detail screen and active version badge.

### Flow E. Rename a Version

1. Admin opens version edit modal.
2. Admin changes `version_tag` and/or `version_description`.
3. Frontend calls `PATCH /admin/versions/:version_id`.
4. If duplicate tag conflict is returned, show an inline error.
5. On success, refresh the version list.

### Flow F. Publish an Application to End Users

1. Admin updates application metadata.
2. Admin sets status to `active`.
3. Frontend calls `PATCH /admin/applications/:id`.
4. Once active, the application becomes eligible for client catalog visibility.

## Error Handling Notes

Frontend should handle these cases clearly:

- `401`: admin session missing or expired
- `404`: application/component/version not found
- `409`: invalid state transition, such as:
  - no previous version for rollback
  - no next version for activate-next
  - duplicate version tag
  - trying to activate a failed version
- `400`: invalid request payload

Recommended UX:

- show inline errors for form issues
- show toast/banner for action failures
- refresh data after every successful mutation

## Frontend Implementation Summary

The admin frontend can now implement:

- stats dashboard
- application list page
- application detail page
- application metadata editor
- version metadata editor
- activate exact version
- rollback component
- activate-next component

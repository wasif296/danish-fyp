const fs = require("fs");
const path = require("path");

const outputPath = path.resolve(__dirname, "..", "..", "DEVELOPER_GUIDE.md");

const content = `# Developer Guide

## Purpose

This guide helps contributors understand how to work safely and efficiently in the School Management System codebase.

## Project Overview

The project is a MERN-based school operations platform with three primary roles:

- Admin
- Teacher
- Student

Core modules include authentication, school structure management, attendance, marks, notices, complaints, assignments, quizzes, fee vouchers, timetable management, content uploads, analytics, and real-time notices.

## Repository Layout

- frontend/ — React application
- backend/ — Express API, models, middleware, and scripts
- backend/config/ — runtime configuration such as Cloudinary
- backend/controllers/ — route handlers and business logic
- backend/models/ — Mongoose schemas and integrity hooks
- backend/routes/ — API route definitions
- backend/scripts/ — operational scripts such as seeding and documentation generation

## Local Setup

### 1. Install dependencies

Backend:

\`npm install --prefix backend\`

Frontend:

\`npm install --prefix frontend\`

### 2. Configure environment files

- Copy backend/.env.example to backend/.env
- Copy frontend/.env.example to frontend/.env

Minimum backend variables:

- MONGO_URL or MONGODB_URI
- JWT_SECRET
- FRONTEND_URL or FRONTEND_URLS
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

Minimum frontend variables:

- REACT_APP_BASE_URL
- REACT_APP_SOCKET_URL

### 3. Run the application

Backend dev server:

\`cd backend && npm run dev\`

Frontend dev server:

\`cd frontend && npm start\`

## Security Conventions

When contributing, preserve the following rules:

- Never trust client-provided role or ownership information.
- Use authMiddleware on protected routes.
- Use checkRole() for role-restricted endpoints.
- Use isOwnerOrAdmin() where a user should only access their own data.
- Validate request payloads with Joi before controller logic.
- Prefer pickAllowedFields() when updating or creating records from request bodies.
- Do not expose password hashes or internal secrets in API responses.

## Data Integrity Conventions

- Be aware of existing Mongoose pre-delete hooks before changing deletion logic.
- If you add a model with uploaded files, include cleanup logic for Cloudinary assets.
- If you introduce parent-child relationships, decide whether cascading delete, detach, or archival behavior is required.
- Keep integrity rules close to the model layer when they apply across multiple controllers.

## Frontend Conventions

- Use the shared Axios instance for API requests.
- Keep user feedback visible through the existing notification and loading patterns.
- Reuse shared components and theme primitives before introducing one-off styling.
- Prefer route-safe changes that preserve the current role-based dashboard flow.

## Backend Conventions

- Keep controllers focused on request orchestration and business logic.
- Move reusable helpers into utils/ when logic is shared.
- Keep environment-driven configuration in one place.
- Fail fast when required production configuration is missing.

## Testing and Validation

Before opening a pull request, run:

Backend tests:

\`cd backend && npm test\`

Frontend production build:

\`cd frontend && npm run build\`

If you edit authentication, uploads, Socket.IO, or deletion logic, validate those flows manually as well.

## Recommended Contribution Workflow

1. Create a focused branch.
2. Understand the affected role flow end to end.
3. Update backend validation and authorization first.
4. Implement UI changes with shared theme and components.
5. Run tests and build checks.
6. Document any new environment variables or scripts.

## Documentation Tasks

If you add a major feature, also update:

- README.md
- backend/.env.example or frontend/.env.example
- seed or operational scripts if onboarding changes
- this Developer Guide if the contribution workflow changes

## Helpful Commands

- \`cd backend && npm run dev\`
- \`cd backend && npm test\`
- \`cd backend && npm run seed:admin\`
- \`cd backend && npm run docs:devguide\`
- \`cd frontend && npm start\`
- \`cd frontend && npm run build\`

## Final Note

Contributors should treat security, integrity, and deployment-readiness as first-class requirements. A change is not complete unless it works functionally, respects authorization boundaries, and leaves the data model in a consistent state.
`;

fs.writeFileSync(outputPath, content, "utf8");
console.log(`Developer guide generated at ${outputPath}`);

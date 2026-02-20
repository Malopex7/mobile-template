You are a senior full-stack engineer. Build me a reusable “starter template” monorepo for new projects using the exact stack below. This template must be production-grade, secure-by-default, and runnable locally with minimal setup.

STACK (must use exactly these):
MOBILE FRONTEND
- Expo (React Native)
- TypeScript
- Expo Router
- NativeWind (Tailwind RN)
- TanStack Query (data fetching + caching)
- Zustand (optional local state; include it but keep usage minimal)

BACKEND
- Node.js + Express
- MongoDB Atlas
- Mongoose
- JWT Auth with Access + Refresh tokens
- .env configuration (separate envs for backend and mobile)

SERVICES
- Storage: “Supabase S3” (use Supabase Storage with S3-compatible approach if applicable; provide a clean abstraction so I can swap to AWS S3 easily)
- Push Notifications: Expo Notifications
- Realtime: Socket.io + MongoDB Change Streams (implement one realtime example end-to-end)
- Deployment targets: Railway / Render / Fly.io / VPS (provide deploy notes + configs for at least Railway and Render)

DELIVERABLES (MUST):
1) A monorepo folder structure:
   - /apps/mobile (Expo app)
   - /apps/api (Express API)
   - /packages/shared (shared types, zod schemas, constants)
   - /docs (project docs)

2) Provide ALL required code files with full implementations (no placeholders).
   - I should be able to run:
     - backend: yarn dev
     - mobile: yarn start
   - Include scripts for lint, typecheck, and tests (basic smoke tests).

3) The template must include:
   A) Authentication (fully working):
      - Register (email + password)
      - Login
      - Refresh token endpoint
      - Logout (invalidate refresh token)
      - Password hashing (bcrypt)
      - Token rotation strategy (refresh token is rotated on refresh)
      - Store refresh tokens securely in DB (hashed) with device/session metadata
      - Protect routes with access token middleware
      - Return clear error messages and status codes

   B) Database setup:
      - Mongoose connection with resilient config + graceful shutdown
      - Example models:
        - User (email, passwordHash, roles)
        - RefreshTokenSession (userId, hashedToken, device, ip, createdAt, expiresAt, revokedAt)
        - ExampleEntity (simple CRUD example: title, description, ownerId, createdAt)
      - Indexes where appropriate

   C) API conventions:
      - Versioned routes: /api/v1
      - Central error handler + request validation middleware
      - Logging (simple but structured)
      - Rate limiting and basic security headers (helmet, cors)
      - Input validation using Zod shared from /packages/shared
      - Provide a Postman collection OR a /docs/api.md with example requests/responses

   D) Mobile app conventions:
      - Expo Router: authenticated and unauthenticated route groups
      - Auth state persisted (secure storage, not AsyncStorage for tokens)
      - TanStack Query configured globally (queryClient, retries, cache times)
      - API client wrapper with automatic token refresh and request retry on 401
      - NativeWind configured with a minimal design system (colors, spacing)
      - A sample flow:
        - Splash → Login/Register → Home → CRUD screen for ExampleEntity
      - Zustand store for small UI state (e.g. theme or onboarding flag), not for server state

   E) Storage integration (Supabase Storage):
      - Backend provides signed upload URL or upload proxy endpoint
      - Mobile uploads a sample image/file
      - Backend stores metadata in MongoDB
      - Include env vars for Supabase project URL, anon/service key, bucket name
      - Provide a clean abstraction layer (/apps/api/src/services/storage)

   F) Push notifications (Expo Notifications):
      - Mobile registers for push token
      - Mobile sends push token to backend
      - Backend stores it under user profile
      - Backend has endpoint to send a test notification to the logged-in user
      - Provide notes about EAS/FCM/APNs requirements, but keep code runnable in dev

   G) Realtime example:
      - Use Socket.io with JWT auth handshake
      - Implement a “live updates” feed:
        - when ExampleEntity is created/updated, notify connected clients
      - Additionally implement MongoDB Change Streams option (if possible in Atlas tier):
        - If Change Streams not supported in free tier, include a fallback path using direct emits from API writes
      - Mobile shows real-time updates in a list

4) Environment management:
   - Provide .env.example for backend and mobile
   - Provide config loader with validation (fail fast if env missing)
   - Ensure secrets never hard-coded
   - Provide “How to run locally” steps in /docs/README.md

5) Tooling & Quality:
   - Use Yarn
   - ESLint + Prettier + TypeScript strict
   - Husky pre-commit (optional but preferred)
   - Basic tests:
     - Backend: auth route test + protected route test
     - Mobile: minimal jest config + one component test or simple unit test

6) Documentation (in /docs):
   - roadmap.md (what to add next)
   - projectPlan.md (how to use template for new projects)
   - completionCriteria.md (definition of done for projects using this template)
   - errorLog.md (how to log errors + known issues section)
   - adaptivePreferences.md (coding conventions: clarity > performance, no placeholders)
   - api.md (routes, payloads, auth strategy)
   - deployment.md (Railway + Render steps; include env vars to set)

7) Output format:
   - Print the entire folder tree first
   - Then provide each file in code blocks with its file path as the header
   - Ensure all import paths are correct
   - Ensure the project runs without missing dependencies
   - Do not skip any file needed for running
   - Do not include “…” or pseudo code
   - Do not ask me questions—make reasonable defaults and proceed.

IMPORTANT RULES:
- No placeholders, no TODOs, no incomplete stubs.
- Security-first: token storage, refresh rotation, CORS, rate limit, password hashing.
- Mobile must handle refresh seamlessly.
- Keep it readable and beginner-friendly, but production-leaning.
- If a feature can’t run in dev (e.g. Change Streams limitations), implement the fallback path and clearly document it.
- Assume Windows 11 environment.
- Assume Docker is NOT available.

Start now.
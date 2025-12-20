# Subscription Tracker API

This document describes the HTTP interface exposed by the Subscription Tracker service. It covers authentication, request/response formats, and every routed endpoint present in the current codebase.

## Base Configuration

| Setting | Value |
| --- | --- |
| Default base URL | `http://localhost:<PORT>` (see `.env.<NODE_ENV>.local`) |
| API prefix | `/api/v1` |
| Auth scheme | Bearer JWT in the `Authorization` header |
| Content type | JSON payloads with `Content-Type: application/json` |

### Environment Variables

Populate `.env.development.local` (or the file that matches `NODE_ENV`) with:

- `PORT` (number)
- `DATABASE_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (e.g., `7d`)
- `ARCJET_KEY`, `ARCJET_ENV`
- `QSTASH_TOKEN`, `QSTASH_URL`
- `SERVER_URL` (publicly reachable base used by Upstash callbacks)
- `EMAIL_USER`, `EMAIL_PASS`

### Error Envelope

All controllers propagate errors to Express error middleware. Successful responses use:

```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* payload */ }
}
```

Failures set `success: false` and an HTTP status code that matches the thrown error (`401`, `404`, etc.).

## Authentication

- Tokens are issued by `POST /api/v1/auth/sign-in` and `POST /api/v1/auth/sign-up`.
- Include the token in `Authorization: Bearer <JWT>` for protected routes.
- The JWT payload contains `userId`. Middleware resolves the full user document and stores it on `req.user`.

## Data Models

### User

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string (2-50 chars) | required |
| `email` | unique string | lowercased, validated |
| `password` | string (>=6 chars) | stored hashed |
| Timestamps | `createdAt`, `updatedAt` | auto-managed |

### Subscription

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | required |
| `price` | number | must be > 0 |
| `currency` | enum (`USD`, `EUR`, `GBP`) | defaults `USD` |
| `frequency` | enum (`daily`, `weekly`, `monthly`, `yearly`) | required for renewal math |
| `category` | enum (`sports`, `news`, `entertainment`, `lifestyle`, `technology`, `finance`, `politics`, `other`) | required |
| `paymentMethod` | string | required |
| `status` | enum (`active`, `cancelled`, `expired`) | defaults `active`, auto-updated when renewal lapses |
| `startDate` | date | must be in the past |
| `renewalDate` | date | defaults to `startDate + frequency`, must be after `startDate` |
| `user` | ObjectId | references `User`, required |

## Endpoint Reference

### Auth Routes (`/api/v1/auth`)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/sign-up` | none | Register a user and immediately return a JWT. |
| POST | `/sign-in` | none | Verify credentials and return a JWT. |
| POST | `/sign-out` | n/a | Route declared but controller not implemented; calling it will throw until `signOut` exists. |

#### POST /api/v1/auth/sign-up

Request body:

```json
{
  "name": "Ava Harper",
  "email": "ava@example.com",
  "password": "secret123"
}
```

Success (201):

```json
{
  "sucess": true,
  "message": "User created successfully",
  "data": {
    "token": "<jwt>",
    "user": {
      "_id": "...",
      "name": "Ava Harper",
      "email": "ava@example.com",
      "password": "<hashed>",
      "createdAt": "...",
      "updatedAt": "...",
      "__v": 0
    }
  }
}
```

#### POST /api/v1/auth/sign-in

Request body:

```json
{
  "email": "ava@example.com",
  "password": "secret123"
}
```

Success (200):

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "<jwt>",
    "user": { /* full user document */ }
  }
}
```

Errors include 404 (user not found) and 401 (invalid password).

### User Routes (`/api/v1/users`)

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/` | none | Returns every user document (including hashed passwords). Use cautiously. |
| GET | `/:id` | required | Returns a single user without the `password` field. No ownership check is enforced. |
| POST | `/` | n/a | Placeholder, responds with `"Create New User..."`. |
| PUT | `/:id` | n/a | Placeholder, responds with `"Update user..."`. |
| DELETE | `/:id` | n/a | Placeholder, responds with `"Delete a user..."`. |

#### GET /api/v1/users

Response (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "...",
      "email": "...",
      "password": "<hashed>",
      "createdAt": "...",
      "updatedAt": "...",
      "__v": 0
    }
  ]
}
```

#### GET /api/v1/users/:id

- Requires `Authorization: Bearer <jwt>`.
- Responds with the same structure as above but without the `password` property.

### Subscription Routes (`/api/v1/subscriptions`)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | required | Returns every subscription, no pagination. |
| POST | `/` | required | Creates a subscription linked to the authenticated user and schedules reminder workflows. |
| GET | `/:id` | required | Fetch a single subscription by Mongo `_id`. |
| GET | `/user/:id` | required | Fetch all subscriptions for a user. Controller enforces `req.user.id === :id`. |
| PUT | `/:id` | n/a | Placeholder response only. |
| DELETE | `/:id` | n/a | Placeholder response only. |
| PUT | `/:id/cancel` | n/a | Placeholder response only. |
| GET | `/upcoming-renewals` | n/a | Placeholder response only. |

#### POST /api/v1/subscriptions

Request body example:

```json
{
  "name": "Spotify Premium",
  "price": 12.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "visa-1234",
  "status": "active",
  "startDate": "2024-01-01T00:00:00.000Z",
  "renewalDate": "2024-02-01T00:00:00.000Z"
}
```

Notes:

- `user` is injected from the authenticated request and cannot be overridden by the client.
- If `renewalDate` is omitted, the model will calculate it from `startDate` and `frequency`.
- A background workflow is triggered via Upstash to send reminder emails at 7, 5, 2, and 1 days before renewal.

Success (201):

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Spotify Premium",
    "user": "<current user id>",
    "status": "active",
    "renewalDate": "2024-02-01T00:00:00.000Z",
    "createdAt": "...",
    "updatedAt": "...",
    "__v": 0
  }
}
```

#### GET /api/v1/subscriptions/user/:id

- Requires `Authorization: Bearer <jwt>`.
- If the path `:id` does not match `req.user.id`, the controller throws 401.
- Response mirrors the structure from the collection endpoint.

### Workflow Routes (`/api/v1/workflows`)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/subscription/reminder` | internal | Triggered by Upstash Workflow to send reminder emails. |

`sendReminders` uses the Upstash Workflow `serve` helper. It expects a payload like:

```json
{
  "subscriptionId": "<mongo id>"
}
```

Flow:

1. Fetch the subscription with populated user fields.
2. Skip processing if `status !== 'active'` or renewal date already passed.
3. For each day offset in `[7, 5, 2, 1]`:
   - Sleep until the reminder timestamp.
   - Send an email via `sendReminderEmail` when the day matches.

## Notes and Limitations

- `POST /api/v1/auth/sign-out` is wired in the router but there is no controller implementation in `auth.controller.js`.
- Several user and subscription routes return placeholder JSON. Treat them as not implemented.
- `GET /api/v1/users` exposes hashed passwords; restrict access before production use.
- There is no rate limiting or pagination yet.
- Upstash workflow requests must be authenticated separately (for example via QStash signatures); the current code assumes trusted requests.

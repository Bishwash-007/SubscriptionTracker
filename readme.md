# Subscription Tracker API

A RESTful API for tracking subscriptions and managing renewal reminders. Built with Node.js, Express, MongoDB, and Upstash Workflow.

## Features

- **User Authentication**: JWT-based authentication with signup, signin, and signout
- **Subscription Management**: Create, read, update, delete, and cancel subscriptions
- **Automated Reminders**: Automated email reminders 7, 5, 2, and 1 days before renewal
- **Rate Limiting**: Express rate limiting to prevent abuse
- **Authorization**: Protected routes with user authentication
- **Upcoming Renewals**: Get subscriptions with upcoming renewal dates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Background Jobs**: Upstash Workflow
- **Email**: Nodemailer
- **Security**: Express Rate Limit

## Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- Gmail account (for email notifications)
- Upstash account (for workflow scheduling)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd subscription-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
touch .env.development.local
```

4. Add environment variables (see Configuration section below)

5. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## Configuration

Create `.env.development.local` with the following variables:

```env
PORT=3000
NODE_ENV=development
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/subscription-tracker
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
QSTASH_TOKEN=your-upstash-token
QSTASH_URL=https://qstash.upstash.io/v1/publish
SERVER_URL=https://your-api-url.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Email Setup (Gmail)

To use Gmail for sending emails:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the generated password as `EMAIL_PASS`

### Upstash Setup

1. Sign up at https://upstash.com/
2. Create a new QStash project
3. Copy your token to `QSTASH_TOKEN`

## Project Structure

```
├── config/
│   ├── env.js          # Environment variables
│   └── upstash.js      # Upstash workflow client
├── controllers/        # HTTP request handlers
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── middlewares/
│   ├── auth.middleware.js    # JWT authentication
│   ├── error.middleware.js   # Global error handler
│   └── rateLimit.middleware.js
├── models/
│   ├── user.model.js
│   └── subscription.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
├── services/           # Business logic
│   ├── auth.service.js
│   ├── subscription.service.js
│   └── user.service.js
├── utils/
│   └── send-email.js   # Email utility
├── app.js              # Express app entry point
└── package.json
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/sign-up` | Register new user | No |
| POST | `/api/v1/auth/sign-in` | Login user | No |
| POST | `/api/v1/auth/sign-out` | Logout user | No |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users | No |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |
| PUT | `/api/v1/users/:id` | Update user | Yes |
| DELETE | `/api/v1/users/:id` | Delete user | Yes |

### Subscriptions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/subscriptions` | Get all subscriptions | Yes |
| GET | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming renewals | Yes |
| GET | `/api/v1/subscriptions/:id` | Get subscription by ID | Yes |
| POST | `/api/v1/subscriptions` | Create subscription | Yes |
| PUT | `/api/v1/subscriptions/:id` | Update subscription | Yes |
| DELETE | `/api/v1/subscriptions/:id` | Delete subscription | Yes |
| PUT | `/api/v1/subscriptions/:id/cancel` | Cancel subscription | Yes |
| GET | `/api/v1/subscriptions/user/:id` | Get user's subscriptions | Yes |

## Data Models

### User

```javascript
{
  name: String (required, min: 2, max: 50),
  email: String (required, unique, lowercase),
  password: String (required, min: 6),
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription

```javascript
{
  name: String (required, min: 2, max: 100),
  price: Number (required, min: 0),
  currency: String (enum: ['USD', 'EUR', 'GBP'], default: 'USD'),
  frequency: String (enum: ['daily', 'weekly', 'monthly', 'yearly']),
  category: String (enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other']),
  paymentMethod: String (required),
  status: String (enum: ['active', 'cancelled', 'expired'], default: 'active'),
  startDate: Date (required, must be in past),
  renewalDate: Date (must be after startDate),
  user: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## Automated Reminders

When a subscription is created, the system automatically schedules email reminders:

- **7 days before renewal**
- **5 days before renewal**
- **2 days before renewal**
- **1 day before renewal**

Reminders are sent to the email address associated with the user account.

## Rate Limiting

API requests are limited to **10 requests per 10 seconds per IP** to prevent abuse.

## Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run lint    # Run ESLint
npm run format  # Format code with Prettier
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## License

MIT

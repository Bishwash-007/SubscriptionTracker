# API Testing with cURL

Complete cURL examples for testing the Subscription Tracker API.

## Base URL

```bash
BASE_URL="http://localhost:5500/api/v1"
```

Or replace with your deployed URL:

```bash
BASE_URL="https://your-api-domain.com/api/v1"
```

---

## Authentication

### Sign Up

```bash
curl -X POST "${BASE_URL}/auth/sign-up" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

### Sign In

```bash
curl -X POST "${BASE_URL}/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

### Sign Out

```bash
curl -X POST "${BASE_URL}/auth/sign-out" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

## Users

Store the JWT token for authenticated requests:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### Get All Users

```bash
curl -X GET "${BASE_URL}/users"
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

### Get User by ID

```bash
curl -X GET "${BASE_URL}/users/USER_ID_HERE" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### Update User

```bash
curl -X PUT "${BASE_URL}/users/USER_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com"
  }'
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "...",
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
}
```

### Delete User

```bash
curl -X DELETE "${BASE_URL}/users/USER_ID_HERE" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Subscriptions

### Create Subscription

```bash
curl -X POST "${BASE_URL}/subscriptions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Netflix Premium",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "Credit Card",
    "startDate": "2024-01-01"
  }'
```

**Expected Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Netflix Premium",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "renewalDate": "2024-02-01T00:00:00.000Z",
    "user": "..."
  }
}
```

### Get All Subscriptions

```bash
curl -X GET "${BASE_URL}/subscriptions" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Netflix Premium",
      "price": 15.99,
      "status": "active",
      ...
    }
  ]
}
```

### Get Subscription by ID

```bash
curl -X GET "${BASE_URL}/subscriptions/SUBSCRIPTION_ID_HERE" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Netflix Premium",
    "price": 15.99,
    "status": "active",
    ...
  }
}
```

### Update Subscription

```bash
curl -X PUT "${BASE_URL}/subscriptions/SUBSCRIPTION_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "price": 19.99,
    "paymentMethod": "PayPal"
  }'
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "_id": "...",
    "name": "Netflix Premium",
    "price": 19.99,
    ...
  }
}
```

### Cancel Subscription

```bash
curl -X PUT "${BASE_URL}/subscriptions/SUBSCRIPTION_ID_HERE/cancel" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "_id": "...",
    "name": "Netflix Premium",
    "status": "cancelled",
    ...
  }
}
```

### Delete Subscription

```bash
curl -X DELETE "${BASE_URL}/subscriptions/SUBSCRIPTION_ID_HERE" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

### Get User's Subscriptions

```bash
curl -X GET "${BASE_URL}/subscriptions/user/USER_ID_HERE" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Netflix Premium",
      "user": "USER_ID_HERE",
      ...
    }
  ]
}
```

### Get Upcoming Renewals

```bash
# Default: 7 days
curl -X GET "${BASE_URL}/subscriptions/upcoming-renewals" \
  -H "Authorization: Bearer ${TOKEN}"

# Custom days (e.g., 14 days)
curl -X GET "${BASE_URL}/subscriptions/upcoming-renewals?days=14" \
  -H "Authorization: Bearer ${TOKEN}"
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Netflix Premium",
      "renewalDate": "2024-12-25T00:00:00.000Z",
      "status": "active",
      "user": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      }
    }
  ]
}
```

---

## Complete Workflow Example

Here's a complete workflow to test the API:

```bash
#!/bin/bash

BASE_URL="http://localhost:5500/api/v1"

# 1. Sign up
echo "1. Signing up..."
SIGNUP_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/sign-up" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $SIGNUP_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $SIGNUP_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

echo "Token: ${TOKEN}"
echo "User ID: ${USER_ID}"

# 2. Create subscription
echo -e "\n2. Creating subscription..."
SUB_RESPONSE=$(curl -s -X POST "${BASE_URL}/subscriptions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Spotify Premium",
    "price": 9.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "Credit Card",
    "startDate": "'"$(date +%Y-%m-%d)"'"
  }')

SUB_ID=$(echo $SUB_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Subscription ID: ${SUB_ID}"

# 3. Get user's subscriptions
echo -e "\n3. Getting user's subscriptions..."
curl -s -X GET "${BASE_URL}/subscriptions/user/${USER_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | head -c 500

# 4. Get upcoming renewals
echo -e "\n\n4. Getting upcoming renewals..."
curl -s -X GET "${BASE_URL}/subscriptions/upcoming-renewals" \
  -H "Authorization: Bearer ${TOKEN}" | head -c 500

# 5. Cancel subscription
echo -e "\n\n5. Cancelling subscription..."
curl -s -X PUT "${BASE_URL}/subscriptions/${SUB_ID}/cancel" \
  -H "Authorization: Bearer ${TOKEN}"

# 6. Delete subscription
echo -e "\n\n6. Deleting subscription..."
curl -s -X DELETE "${BASE_URL}/subscriptions/${SUB_ID}" \
  -H "Authorization: Bearer ${TOKEN}"

echo -e "\n\nDone!"
```

---

## Common Errors

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Fix**: Include the Authorization header with a valid JWT token.

### 404 Not Found

```json
{
  "success": false,
  "message": "Subscription not found with id: ..."
}
```

**Fix**: Check that the ID exists and belongs to the authenticated user.

### 409 Conflict

```json
{
  "success": false,
  "message": "User already exists"
}
```

**Fix**: Use a different email address.

### 429 Too Many Requests

```json
{
  "message": "Too many requests, please try again later"
}
```

**Fix**: Wait a few seconds before making more requests.

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

**Fix**: Check server logs for more details.

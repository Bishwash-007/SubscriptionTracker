#!/bin/bash

BASE_URL="http://localhost:3000/api/v1"

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
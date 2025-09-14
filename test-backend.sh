#!/bin/bash

# Test script to check if backend is working
echo "Testing backend health..."
curl -X GET https://personal-finance-backend-hf4k.onrender.com/api/health

echo ""
echo "Testing auth signup endpoint..."
curl -X POST https://personal-finance-backend-hf4k.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

echo ""
echo "Testing auth login endpoint..."
curl -X POST https://personal-finance-backend-hf4k.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
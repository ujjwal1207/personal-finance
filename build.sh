#!/bin/bash
set -e  # Exit on any error

echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la

echo "Checking if client directory exists..."
if [ -d "client" ]; then
    echo "Client directory found, proceeding with build..."
    cd client
    echo "Installing dependencies..."
    npm install
    echo "Building React app..."
    npm run build
    echo "Build completed successfully!"
else
    echo "ERROR: Client directory not found!"
    echo "Available directories:"
    ls -la
    exit 1
fi
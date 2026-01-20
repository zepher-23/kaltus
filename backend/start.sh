#!/bin/bash

# Kaltus Backend Start Script for Railway
# This script is executed by Railway to start the application

echo "🚀 Starting Kaltus Backend..."
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-5000}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "✅ Starting server..."
npm start

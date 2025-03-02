#!/bin/sh

# Exit on error
set -e

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the app
npm run build

# Move build files to static directory
cp -r dist/* ../static/

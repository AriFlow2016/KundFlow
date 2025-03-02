#!/bin/bash

# Exit on error and print each command
set -ex

# Navigate to project root
cd "$(dirname "$0")"

# Install dependencies and build frontend
cd frontend
npm ci --production=false
npm run build

# The build output will be in frontend/dist
# render.yaml is configured to serve from this directory

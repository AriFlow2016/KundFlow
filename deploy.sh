#!/bin/bash

# Exit on error
set -e

# Install dependencies and build frontend
cd frontend
npm install --production=false
npm run build

# The build output will be in frontend/dist
# render.yaml is configured to serve from this directory

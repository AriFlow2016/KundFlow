#!/bin/bash

echo "Current directory:"
pwd

echo "Directory contents:"
ls -la

echo "Moving to frontend directory..."
cd frontend || exit 1

echo "Frontend directory contents:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Build complete!"

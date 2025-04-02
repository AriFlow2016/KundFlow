#!/bin/bash

cd "$(dirname "$0")"
echo "Startar KundFlow från $(pwd)"

# Kör servern
node start.js

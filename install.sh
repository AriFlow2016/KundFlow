#!/bin/bash

echo "Installerar KundFlow..."

# Skapa mockdata-mappen
mkdir -p backend/mockdata

# Skapa frontend index.html om den inte finns
mkdir -p frontend/public
touch frontend/public/index.html

# Installera huvudpaket
npm init -y
npm install concurrently uuid

# Installera backend-paket
cd backend
npm init -y
npm install express mongoose cors dotenv morgan bcryptjs jsonwebtoken uuid
npm install nodemon --save-dev
cd ..

# Installera frontend-paket
cd frontend
npm init -y
npm install react react-dom react-router-dom react-scripts @mui/material @mui/icons-material @emotion/react @emotion/styled i18next react-i18next axios
cd ..

echo "Installation klar! Kör 'npm start' för att starta projektet."

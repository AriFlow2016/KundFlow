#!/bin/bash

echo "Startar KundFlow (enkel version)..."

# Installera paket om det behövs
if [ ! -d "node_modules" ]; then
  echo "Installerar grundläggande paket..."
  npm install express cors
fi

# Starta en enkel server som serverar frontend-filer och API
cat > simple-server.js << EOL
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Enkel API-endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Välkommen till KundFlow API!' });
});

// Skicka index.html för alla vägar
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server igång på http://localhost:\${PORT}\`);
  console.log('Öppna denna adress i din webbläsare för att se KundFlow');
});
EOL

# Skapa en enkel HTML-fil om den inte finns
if [ ! -f "frontend/public/index.html" ]; then
  mkdir -p frontend/public
  cat > frontend/public/index.html << EOL
<!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>KundFlow</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
      .container { max-width: 800px; margin: 0 auto; }
      .card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; }
      h1 { color: #2196f3; }
      .button { background: #2196f3; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>KundFlow</h1>
      <div class="card">
        <h2>Välkommen till KundFlow</h2>
        <p>Din CRM-lösning med fokus på telefoni för den svenska marknaden.</p>
        <p>Status: <span id="status">Kontrollerar anslutning...</span></p>
        <button class="button" id="checkApi">Kontrollera API</button>
      </div>
    </div>
    <script>
      document.getElementById('checkApi').addEventListener('click', async () => {
        try {
          const response = await fetch('/api/hello');
          const data = await response.json();
          document.getElementById('status').textContent = 'Ansluten! ' + data.message;
        } catch (error) {
          document.getElementById('status').textContent = 'Fel vid anslutning till API';
          console.error('API Error:', error);
        }
      });
    </script>
  </body>
</html>
EOL
fi

# Kör servern
node simple-server.js

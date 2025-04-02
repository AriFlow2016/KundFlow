const http = require('http');
const fs = require('fs');
const path = require('path');

console.log("Startar KundFlow demo-server...");

// Skapa HTML-innehållet
const htmlContent = `
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KundFlow</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
        }
        .card { 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            padding: 20px; 
            margin-bottom: 20px; 
        }
        h1, h2 { color: #2196f3; }
        .button { 
            background: #2196f3; 
            color: white; 
            border: none; 
            padding: 10px 15px; 
            border-radius: 4px; 
            cursor: pointer; 
        }
        .demo-section {
            margin-top: 30px;
        }
        .demo-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .demo-table th, .demo-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .demo-table th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>KundFlow</h1>
            <p>Din CRM-lösning med fokus på telefoni för den svenska marknaden.</p>
            <p>Servern är igång!</p>
        </div>
        
        <div class="card demo-section">
            <h2>Leads</h2>
            <table class="demo-table">
                <thead>
                    <tr>
                        <th>Namn</th>
                        <th>Företag</th>
                        <th>Status</th>
                        <th>Telefon</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Anna Andersson</td>
                        <td>Teknikbolaget AB</td>
                        <td>Ny</td>
                        <td>070-123 45 67</td>
                    </tr>
                    <tr>
                        <td>Bengt Bengtsson</td>
                        <td>Byggservice Sverige</td>
                        <td>Kontaktad</td>
                        <td>070-234 56 78</td>
                    </tr>
                    <tr>
                        <td>Cecilia Carlsson</td>
                        <td>Designbyrån</td>
                        <td>Kvalificerad</td>
                        <td>070-345 67 89</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="card demo-section">
            <h2>Konton</h2>
            <table class="demo-table">
                <thead>
                    <tr>
                        <th>Namn</th>
                        <th>Typ</th>
                        <th>Org. nummer</th>
                        <th>Stad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Teknikbolaget AB</td>
                        <td>Kund</td>
                        <td>556123-4567</td>
                        <td>Stockholm</td>
                    </tr>
                    <tr>
                        <td>Byggservice Sverige</td>
                        <td>Kund</td>
                        <td>556234-5678</td>
                        <td>Göteborg</td>
                    </tr>
                    <tr>
                        <td>Designbyrån</td>
                        <td>Partner</td>
                        <td>556345-6789</td>
                        <td>Malmö</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
`;

// Skapa en enkel HTTP-server
const server = http.createServer((req, res) => {
    if (req.url === '/api/hello' && req.method === 'GET') {
        // API-endpoint
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Välkommen till KundFlow API!' }));
    } else {
        // Returnera HTML för alla andra förfrågningar
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
    }
});

const PORT = 3000;

// Lyssna på alla nätverksinterface för att göra den tillgänglig externt också
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server igång på http://localhost:${PORT}`);
    console.log(`Du kan även nå den på http://127.0.0.1:${PORT}`);
    console.log('Öppna någon av dessa adresser i din webbläsare för att se KundFlow');
});

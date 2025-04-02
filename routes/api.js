const express = require('express');
const router = express.Router();

// Exempel på en GET-rutt
router.get('/kunder', (req, res) => {
  // Här skulle du hämta kunder från din databas
  const kunder = [
    { id: 1, namn: 'Företag AB', kontakt: 'Anna Andersson' },
    { id: 2, namn: 'Tech Solutions', kontakt: 'Erik Svensson' }
  ];
  
  res.json(kunder);
});

// Exempel på en POST-rutt för att lägga till en ny kund
router.post('/kunder', (req, res) => {
  // Här skulle du skapa en ny kund i din databas
  const nyKund = req.body;
  
  // Simulerar att vi lägger till kunden och får ett ID
  nyKund.id = 3;
  
  res.status(201).json(nyKund);
});

// Fler rutter kan läggas till här

module.exports = router;

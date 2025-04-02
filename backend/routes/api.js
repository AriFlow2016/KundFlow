const express = require('express');
const router = express.Router();

// Importera route-hanterare för olika entiteter
const leadsRoutes = require('./leads');
const accountsRoutes = require('./accounts');
const contactsRoutes = require('./contacts');
const opportunitiesRoutes = require('./opportunities');
const casesRoutes = require('./cases');

// Använd de olika routes
router.use('/leads', leadsRoutes);
router.use('/accounts', accountsRoutes);
router.use('/contacts', contactsRoutes);
router.use('/opportunities', opportunitiesRoutes);
router.use('/cases', casesRoutes);

// Exempel på en GET-rutt för kunder (legacy/bakåtkompatibel)
router.get('/kunder', (req, res) => {
  // Här skulle du hämta kunder från din databas
  const kunder = [
    { id: 1, namn: 'Företag AB', kontakt: 'Anna Andersson' },
    { id: 2, namn: 'Tech Solutions', kontakt: 'Erik Svensson' }
  ];
  
  res.json(kunder);
});

// Exempel på en POST-rutt för att lägga till en ny kund (legacy/bakåtkompatibel)
router.post('/kunder', (req, res) => {
  // Här skulle du skapa en ny kund i din databas
  const nyKund = req.body;
  
  // Simulerar att vi lägger till kunden och får ett ID
  nyKund.id = 3;
  
  res.status(201).json(nyKund);
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Temporär datalagring (ersätts senare med databas)
let leads = [
  { 
    id: 1, 
    företag: 'Potentiell Kund AB', 
    kontaktperson: 'Maria Johansson',
    telefon: '08-123 45 67',
    email: 'maria@potentiellkund.se',
    status: 'Ny',
    källa: 'Webbformulär',
    skapad: '2023-10-15'
  },
  { 
    id: 2, 
    företag: 'Intresserad Företag HB', 
    kontaktperson: 'Johan Karlsson',
    telefon: '070-123 45 67',
    email: 'johan@intresserad.se',
    status: 'Kontaktad',
    källa: 'Mässa',
    skapad: '2023-10-10'
  }
];

// Hämta alla leads
router.get('/', (req, res) => {
  res.json(leads);
});

// Hämta en specifik lead med ID
router.get('/:id', (req, res) => {
  const lead = leads.find(lead => lead.id === parseInt(req.params.id));
  if (!lead) return res.status(404).json({ meddelande: 'Lead hittades inte' });
  res.json(lead);
});

// Skapa en ny lead
router.post('/', (req, res) => {
  const newLead = {
    id: leads.length + 1,
    företag: req.body.företag,
    kontaktperson: req.body.kontaktperson,
    telefon: req.body.telefon,
    email: req.body.email,
    status: req.body.status || 'Ny',
    källa: req.body.källa,
    skapad: new Date().toISOString().split('T')[0]
  };
  
  leads.push(newLead);
  res.status(201).json(newLead);
});

// Uppdatera en lead
router.put('/:id', (req, res) => {
  const lead = leads.find(lead => lead.id === parseInt(req.params.id));
  if (!lead) return res.status(404).json({ meddelande: 'Lead hittades inte' });
  
  Object.assign(lead, req.body);
  res.json(lead);
});

// Radera en lead
router.delete('/:id', (req, res) => {
  const leadIndex = leads.findIndex(lead => lead.id === parseInt(req.params.id));
  if (leadIndex === -1) return res.status(404).json({ meddelande: 'Lead hittades inte' });
  
  leads.splice(leadIndex, 1);
  res.json({ meddelande: 'Lead raderad' });
});

// Konvertera lead till kund
router.post('/:id/convert', (req, res) => {
  const lead = leads.find(lead => lead.id === parseInt(req.params.id));
  if (!lead) return res.status(404).json({ meddelande: 'Lead hittades inte' });
  
  // Här skulle du skapa ett konto, kontakt och kanske affärsmöjlighet
  // baserat på lead-data, och sedan markera lead som konverterad
  
  lead.status = 'Konverterad';
  res.json({
    meddelande: 'Lead konverterad till kund',
    lead
  });
});

module.exports = router;

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialisera Express-appen
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Statiska filer
app.use(express.static(path.join(__dirname, 'public')));

// API-rutter
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Skicka alla andra förfrågningar till index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Portnummer
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server startad på port ${PORT}`);
});

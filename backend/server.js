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

// API-rutter
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Serve static files from the React frontend app om vi är i produktion
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // För alla GET-requests som inte är API, skicka React's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Portnummer
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server startad på port ${PORT}`);
});

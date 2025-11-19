require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB (non-bloquant)
connectDB().then(connected => {
  if (connected) {
    console.log('Base de données prête');
  } else {
    console.warn('Application démarrée sans connexion DB');
  }
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));

// Route de santé pour vérifier l'état de l'API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      hasMongoUri: !!process.env.MONGODB_URI || !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Route principale - sert l'interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;

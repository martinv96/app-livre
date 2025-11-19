const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('ERREUR: Variable MONGO_URI ou MONGODB_URI manquante');
      return false;
    }
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connecté avec succès');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    return false;
  }
};

module.exports = connectDB;

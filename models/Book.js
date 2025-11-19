const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  auteur: {
    type: String,
    required: true,
    trim: true
  },
  categorie: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  disponibilite: {
    type: Boolean,
    default: true
  },
  resume: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);

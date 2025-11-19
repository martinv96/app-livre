const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  historiqueEmprunts: [{
    // le type de l'objet veut dire que ce champ référence des documents dans une autre collection
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

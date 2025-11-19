const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  dateEmprunt: {
    type: Date,
    default: Date.now
  },
  dateRetour: {
    type: Date
  },
  status: {
    type: String,
    enum: ['en cours', 'retourné', 'en retard'],
    default: 'en cours'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);

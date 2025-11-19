const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /loans - Emprunter un livre (protégé)
router.post('/', authMiddleware, loanController.createLoan);

// GET /loans/:userId - Historique des emprunts (protégé)
router.get('/:userId', authMiddleware, loanController.getUserLoans);

module.exports = router;

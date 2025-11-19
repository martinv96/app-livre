const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, loanController.createLoan);

router.get('/:userId', authMiddleware, loanController.getUserLoans);

module.exports = router;

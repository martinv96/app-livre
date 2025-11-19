const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /users/register - Inscription
router.post('/register', userController.register);

// POST /users/login - Connexion
router.post('/login', userController.login);

module.exports = router;

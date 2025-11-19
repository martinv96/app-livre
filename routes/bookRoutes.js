const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /books - Liste des livres avec filtres (accessible sans authentification)
router.get('/', bookController.getBooks);

// POST /books - Ajouter un livre (protégé)
router.post('/', authMiddleware, bookController.addBook);

// PUT /books/:id - Modifier un livre (protégé)
router.put('/:id', authMiddleware, bookController.updateBook);

// DELETE /books/:id - Supprimer un livre (protégé)
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;

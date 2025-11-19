const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');

// POST /loans - Emprunter un livre
exports.createLoan = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Vérifier si le livre est disponible
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (!book.disponibilite) {
      return res.status(400).json({ message: 'Livre non disponible' });
    }

    // Créer l'emprunt
    const newLoan = new Loan({
      userId,
      bookId,
      status: 'en cours'
    });

    await newLoan.save();

    // Mettre à jour la disponibilité du livre
    book.disponibilite = false;
    await book.save();

    // Ajouter l'emprunt à l'historique de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $push: { historiqueEmprunts: newLoan._id }
    });

    res.status(201).json({ message: 'Emprunt créé avec succès', loan: newLoan });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /loans/:userId - Historique des emprunts
exports.getUserLoans = async (req, res) => {
  try {
    const { userId } = req.params;

    const loans = await Loan.find({ userId })
      .populate('bookId')
      .sort({ dateEmprunt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

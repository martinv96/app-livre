const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');

exports.createLoan = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (!book.disponibilite) {
      return res.status(400).json({ message: 'Livre non disponible' });
    }

    const newLoan = new Loan({
      userId,
      bookId,
      status: 'en cours'
    });

    await newLoan.save();

    book.disponibilite = false;
    await book.save();

    await User.findByIdAndUpdate(userId, {
      $push: { historiqueEmprunts: newLoan._id }
    });

    res.status(201).json({ message: 'Emprunt créé avec succès', loan: newLoan });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

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

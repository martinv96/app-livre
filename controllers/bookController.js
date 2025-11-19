const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const { titre, auteur, categorie, disponibilite } = req.query;
    const filter = {};

    if (titre) filter.titre = { $regex: titre, $options: 'i' };
    if (auteur) filter.auteur = { $regex: auteur, $options: 'i' };
    if (categorie) filter.categorie = { $regex: categorie, $options: 'i' };
    if (disponibilite !== undefined) filter.disponibilite = disponibilite === 'true';

    const books = await Book.find(filter);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { titre, auteur, categorie, isbn, resume } = req.body;

    const newBook = new Book({
      titre,
      auteur,
      categorie,
      isbn,
      resume,
      disponibilite: true
    });

    await newBook.save();
    res.status(201).json({ message: 'Livre ajouté avec succès', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const book = await Book.findByIdAndUpdate(id, updates, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    res.json({ message: 'Livre modifié avec succès', book });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

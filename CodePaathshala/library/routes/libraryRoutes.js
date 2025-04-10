const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// Create new item
router.post('/', libraryController.createLibraryItem);

// Get all items (optional filter by ?type=Assignment|Quiz|Course)
router.get('/', libraryController.getLibraryItems);

// Get single item
router.get('/:id', libraryController.getLibraryItem);

// Update item
router.put('/:id', libraryController.updateLibraryItem);

// Delete item
router.delete('/:id', libraryController.deleteLibraryItem);

module.exports = router;

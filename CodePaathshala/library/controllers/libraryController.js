const LibraryItem = require('../models/LibraryItem');

/* --------------------------------------------
   ✅ Create a new library item
   POST /api/library
-------------------------------------------- */
exports.createLibraryItem = async (req, res) => {
  try {
    const newItem = new LibraryItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Item created', item: savedItem });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item', error: err.message });
  }
};

/* --------------------------------------------
   ✅ Get all items (filter by type optional)
   GET /api/library?type=Assignment
-------------------------------------------- */
exports.getLibraryItems = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const items = await LibraryItem.find(query).sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
};

/* --------------------------------------------
   ✅ Get single item by ID
   GET /api/library/:id
-------------------------------------------- */
exports.getLibraryItem = async (req, res) => {
  try {
    const item = await LibraryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch item', error: err.message });
  }
};

/* --------------------------------------------
   ✅ Update item
   PUT /api/library/:id
-------------------------------------------- */
exports.updateLibraryItem = async (req, res) => {
  try {
    const updatedItem = await LibraryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item updated', item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
};

/* --------------------------------------------
   ✅ Delete item
   DELETE /api/library/:id
-------------------------------------------- */
exports.deleteLibraryItem = async (req, res) => {
  try {
    const deletedItem = await LibraryItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};

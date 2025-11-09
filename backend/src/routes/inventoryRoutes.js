const express = require('express');
const router = express.Router();
const {
  createInventory,
  getInventories,
  getInventory,
  updateInventory,
  deleteInventory,
} = require('../controllers/inventoryController');

// GET all
router.get('/', getInventories);

// GET one
router.get('/:id', getInventory);

// POST create
router.post('/', createInventory);

// PUT update
router.put('/:id', updateInventory);

// DELETE remove
router.delete('/:id', deleteInventory);

module.exports = router;

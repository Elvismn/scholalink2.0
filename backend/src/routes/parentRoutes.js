const express = require('express');
const router = express.Router();
const {
  createParent,
  getParents,
  getParent,
  updateParent,
  deleteParent,
} = require('../controllers/parentController');

// GET all
router.get('/', getParents);

// GET one
router.get('/:id', getParent);

// POST create
router.post('/', createParent);

// PUT update
router.put('/:id', updateParent);

// DELETE remove
router.delete('/:id', deleteParent);

module.exports = router;

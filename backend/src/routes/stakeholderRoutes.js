const express = require('express');
const router = express.Router();
const {
  createStakeholder,
  getStakeholders,
  getStakeholder,
  updateStakeholder,
  deleteStakeholder,
} = require('../controllers/stakeholderController');

// GET all
router.get('/', getStakeholders);

// GET one
router.get('/:id', getStakeholder);

// POST create
router.post('/', createStakeholder);

// PUT update
router.put('/:id', updateStakeholder);

// DELETE remove
router.delete('/:id', deleteStakeholder);

module.exports = router;

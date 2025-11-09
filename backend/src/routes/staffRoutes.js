const express = require('express');
const router = express.Router();
const {
  createStaff,
  getStaff,
  getOneStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');

// GET all
router.get('/', getStaff);

// GET one
router.get('/:id', getOneStaff);

// POST create
router.post('/', createStaff);

// PUT update
router.put('/:id', updateStaff);

// DELETE remove
router.delete('/:id', deleteStaff);

module.exports = router;

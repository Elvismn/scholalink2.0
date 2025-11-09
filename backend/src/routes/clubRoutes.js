const express = require('express');
const router = express.Router();
const {
  createClub,
  getClubs, 
  getClub,
  updateClub,
  deleteClub,
} = require('../controllers/clubController');

// GET all
router.get('/', getClubs);

// GET one
router.get('/:id', getClub);

// POST create
router.post('/', createClub);

// PUT update
router.put('/:id', updateClub);

// DELETE remove
router.delete('/:id', deleteClub);

module.exports = router;

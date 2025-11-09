const express = require('express');
const router = express.Router();
const {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classroomController');

// GET all
router.get('/', getClassrooms);

// GET one
router.get('/:id', getClassroom);

// POST create
router.post('/', createClassroom);

// PUT update
router.put('/:id', updateClassroom);

// DELETE remove
router.delete('/:id', deleteClassroom);

module.exports = router;

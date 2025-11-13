const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

// GET all
router.get('/', getStudents);

// GET one
router.get('/:id', getStudent);

// POST create
router.post('/', createStudent);

// PUT update
router.put('/:id', updateStudent);

// DELETE remove
router.delete('/:id', deleteStudent);

module.exports = router;
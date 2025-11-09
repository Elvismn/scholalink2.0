const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

// GET all
router.get('/', getCourses);

// GET one
router.get('/:id', getCourse);

// POST create
router.post('/', createCourse);

// PUT update
router.put('/:id', updateCourse);

// DELETE remove
router.delete('/:id', deleteCourse);

module.exports = router;

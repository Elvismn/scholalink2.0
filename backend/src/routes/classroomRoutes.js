const express = require('express');
const router = express.Router();
const {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classroomController');

// GET all classrooms
router.get('/', getClassrooms);

// GET one classroom by ID
router.get('/:id', getClassroom);

// POST create classroom
router.post('/', createClassroom);

// PUT update classroom by ID
router.put('/:id', updateClassroom);

// DELETE classroom by ID
router.delete('/:id', deleteClassroom);

module.exports = router;
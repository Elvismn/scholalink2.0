const express = require('express');
const router = express.Router();
const {
  createCurriculum,
  getCurriculums, 
  getCurriculum,
  updateCurriculum,
  deleteCurriculum,
} = require('../controllers/curriculumController');

// GET all
router.get('/', getCurriculums);

// GET one
router.get('/:id', getCurriculum);

// POST create
router.post('/', createCurriculum);

// PUT update
router.put('/:id', updateCurriculum);

// DELETE remove
router.delete('/:id', deleteCurriculum);

module.exports = router;

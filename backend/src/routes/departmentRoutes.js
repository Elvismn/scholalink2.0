const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
// GET all
router.get('/', getDepartments);

// GET one
router.get('/:id', getDepartment);

// POST create
router.post('/', createDepartment);

// PUT update
router.put('/:id', updateDepartment);

// DELETE remove
router.delete('/:id', deleteDepartment);

module.exports = router;


const Curriculum = require("../models/curriculum");

// Create a new curriculum
const createCurriculum = async (req, res) => {
  try {
    const curriculum = await Curriculum.create(req.body);
    res.status(201).json(curriculum);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all curriculums
const getCurriculums = async (req, res) => {
  try {
    const curriculums = await Curriculum.find();
    res.json(curriculums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single curriculum by ID
const getCurriculum = async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id);
    if (!curriculum) return res.status(404).json({ message: "Curriculum not found" });
    res.json(curriculum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a curriculum by ID
const updateCurriculum = async (req, res) => {
  try {
    const updated = await Curriculum.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a curriculum by ID
const deleteCurriculum = async (req, res) => {
  try {
    await Curriculum.findByIdAndDelete(req.params.id);
    res.json({ message: "Curriculum deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCurriculum,
  getCurriculums, 
  getCurriculum,
  updateCurriculum,
  deleteCurriculum,
};
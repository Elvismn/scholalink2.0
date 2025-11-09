const Stakeholder = require("../models/stakeholder");

// create stakeholder
const createStakeholder = async (req, res) => {
  try {
    const stakeholder = await Stakeholder.create(req.body);
    res.status(201).json(stakeholder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all stakeholders
const getStakeholders = async (req, res) => {
  try {
    const stakeholders = await Stakeholder.find();
    res.json(stakeholders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get stakeholder by id
const getStakeholder = async (req, res) => {
  try {
    const stakeholder = await Stakeholder.findById(req.params.id);
    if (!stakeholder) return res.status(404).json({ message: "Stakeholder not found" });
    res.json(stakeholder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update stakeholder
const updateStakeholder = async (req, res) => {
  try {
    const updated = await Stakeholder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete stakeholder
const deleteStakeholder = async (req, res) => {
  try {
    await Stakeholder.findByIdAndDelete(req.params.id);
    res.json({ message: "Stakeholder deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStakeholder,
  getStakeholders,
  getStakeholder,
  updateStakeholder,
  deleteStakeholder,
};
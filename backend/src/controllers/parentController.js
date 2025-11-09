const Parent = require("../models/parent");

// create parent
const createParent = async (req, res) => {
  try {
    const parent = await Parent.create(req.body);
    res.status(201).json(parent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all parents
const getParents = async (req, res) => {
  try {
    const parents = await Parent.find();
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get parent by id
const getParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update parent
const updateParent = async (req, res) => {
  try {
    const updated = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete parent
const deleteParent = async (req, res) => {
  try {
    await Parent.findByIdAndDelete(req.params.id);
    res.json({ message: "Parent deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createParent,
  getParents,
  getParent,
  updateParent,
  deleteParent,
};
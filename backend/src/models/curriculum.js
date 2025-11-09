const mongoose = require("mongoose");   

const curriculumSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
  },
  academicYear: { 
    type: String, 
    required: true
  },
  subjects: [{ 
    type: String 
  }],
  description: { 
    type: String 
  },
}, { timestamps: true });

module.exports = mongoose.model("Curriculum", curriculumSchema);

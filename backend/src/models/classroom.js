const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  gradeLevel: { 
    type: String 
  },
  numberOfStudents: { 
    type: Number, 
    default: 0 
  },
  classTeacher: { 
    type: String 
  },
  capacity: { 
    type: Number 
  },
}, { timestamps: true });

module.exports = mongoose.model("Classroom", classroomSchema);  

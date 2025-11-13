const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  studentId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  grade: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: Date 
  },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other"] 
  },
  parentName: { 
    type: String 
  },
  parentContact: { 
    type: String 
  },
  parentEmail: { 
    type: String 
  },
  address: { 
    type: String 
  },
  emergencyContact: { 
    type: String 
  },
  medicalInfo: { 
    type: String 
  },
  enrollmentDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ["Active", "Inactive", "Transferred", "Graduated"], 
    default: "Active" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  role: { 
    type: String, 
    enum: ["Teaching", "Non-Teaching"], 
    required: true 
  },
  position: { 
    type: String 
  },
  department: { 
    type: String 
  },
  contact: { 
    type: String 
  },
  email: { 
    type: String, 
    unique: true 
  },
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);

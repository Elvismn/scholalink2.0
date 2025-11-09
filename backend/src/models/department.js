const mongoose = require("mongoose"); 

const departmentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  head: { 
    type: 
    String 
},
  description: { 
    type: String 
},
  numberOfStaff: { 
    type: Number, 
    default: 0 
},
}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);  

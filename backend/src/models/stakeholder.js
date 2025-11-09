const mongoose = require("mongoose");
const stakeholderSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  type: { 
    type: String, 
    enum: ["Distributor", "Collaborator", "Wellwisher"], 
    required: true 
},
  contact: { 
    type: String 
},
  email: { 
    type: String 
},
  contribution: { 
    type: String 
},
}, { timestamps: true });

module.exports = mongoose.model("Stakeholder", stakeholderSchema);

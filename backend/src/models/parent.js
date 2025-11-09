const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  contact: { 
    type: String, 
    required: true 
},
  email: { 
    type: String 
},
  address: { 
    type: String 
},
  children: [
    { type: String 

    }
], 
}, { timestamps: true });

module.exports = mongoose.model("Parent", parentSchema);

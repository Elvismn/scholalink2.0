const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true 
},
  category: { 
    type: String, 
    enum: ["Library", "Lab", "General"], 
    required: true 
},
  quantity: { 
    type: Number, 
    default: 1 
},
  condition: { 
    type: String, 
    default: "Good" 
},
  lastChecked: { 
    type: Date, 
    default: Date.now 
},
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);

const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  patron: { 
    type: String 
},
  membersCount: { 
    type: Number, 
    default: 0 },
  activities: [
    { type: String }
],
}, { timestamps: true });

module.exports = mongoose.model("Club", clubSchema);

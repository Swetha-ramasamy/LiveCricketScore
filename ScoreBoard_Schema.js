// Score Schema
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  batting_team: String,   
  runs: Number,           
  wickets: Number,        
  last_updated: { type: Date, default: Date.now }
});
const Score_collection = mongoose.model('Score',scoreSchema)
module.exports = Score_collection;

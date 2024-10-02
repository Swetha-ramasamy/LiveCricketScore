// Score Schema
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  batting_team: String,   // Example: "India"
  runs: Number,           // Total runs scored by the batting team
  wickets: Number,        // Total wickets lost by the batting team
  last_updated: { type: Date, default: Date.now }
});
const Score_collection = mongoose.model('Score',scoreSchema)
module.exports = Score_collection;

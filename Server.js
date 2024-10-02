// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectionDb = require("./Connection");
const Score_collection = require("./ScoreBoard_Schema");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

connectionDb()
app.post('/initialize', async (req, res) => {
    const { batting_team } = req.body;
    try {
      const found = await Score_collection.findOne({batting_team});
      if(!found){
        const newScore = await Score_collection.create({
          batting_team,
          runs: 0,
          wickets: 0
        });
        res.status(200).json({ success: true, data: newScore });
      }
      else{
        res.status(200).json({ success: true, data: found });
      }
     
      
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error initializing match' });
    }
  });
  
 
  app.post('/update-score', async (req, res) => {
    
    const { batting_team, run, isWicket } = req.body;
    try {
      const score = await Score_collection.findOne({ batting_team });
      if (!score) {
        return res.status(404).json({ success: false, message: 'Batting team not found' });
      }
  
      score.runs += run;
      if (isWicket) score.wickets += 1;
      score.last_updated = Date.now();
  
      await score.save();
      
      io.emit('scoreUpdate', score);
      
      res.status(200).json({ success: true, data: score });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating score' });
    }
  });
  

app.get('/scores', async (req, res) => {
  try {
    const { batting_team } = req.query;
    const score = await Score_collection.findOne({ batting_team });
    if (!score) {
      return res.status(404).json({ success: false, message: 'Batting team not found' });
    }
    res.status(200).json({ success: true, data: score }); // Ensure 'data' contains batting_team
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching score' });
  }
});

  
 
  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

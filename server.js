const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory storage
let bins = []; // Latest sensor data from microcontroller
let pendingCommands = {}; // Commands to send to microcontroller

// 🔹 Webhook endpoint: Microcontroller sends bin data here
app.post('/api/bin-status', (req, res) => {
  const data = req.body;
  console.log('📦 Bin data received:', data);

  const index = bins.findIndex(b => b.binId === data.binId);
  if (index >= 0) bins[index] = data;
  else bins.push(data);

  res.json({ message: 'Bin data received' });
});

// 🔹 Endpoint for frontend to fetch all bins
app.get('/api/bins', (req, res) => {
  res.json(bins);
});

// 🔹 Endpoint to receive commands from frontend
app.post('/api/send-command', (req, res) => {
  const { binId, command } = req.body;
  console.log(`Command received for ${binId}: ${command}`);

  if (!pendingCommands[binId]) pendingCommands[binId] = [];
  pendingCommands[binId].push(command);

  res.json({ message: 'Command queued' });
});

// 🔹 Endpoint for microcontroller to get pending commands
app.get('/api/get-commands/:binId', (req, res) => {
  const binId = req.params.binId;
  const cmds = pendingCommands[binId] || [];
  pendingCommands[binId] = []; // clear after sending
  res.json(cmds);
});

// 🔹 Delete a bin
app.delete('/api/bins/:binId', (req, res) => {
  const binId = req.params.binId;
  const index = bins.findIndex(b => b.binId === binId);
  if (index >= 0) {
    bins.splice(index, 1);
    return res.json({ message: `Bin ${binId} deleted` });
  }
  res.status(404).json({ message: 'Bin not found' });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

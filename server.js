const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory storage
let bins = []; // Latest sensor data
let pendingCommands = {}; // Commands to microcontroller

// 🔹 Webhook endpoint: Microcontroller sends bin data here
app.post('/api/bin-status', (req, res) => {
  const data = req.body;
  console.log('📦 Bin data received:', data);

  const newBins = [];

  if (data.master_node) {
    const master = data.master_node;
    newBins.push({
      binId: master.bin_id,
      timestamp: master.timestamp,
      fill_level: master.fill_level,
      battery: master.battery,
      signal_strength: master.signal_strength,
      temperature: master.temperature,
      humidity: master.humidity,
      is_master: master.is_master,
      master_id: master.master_id,
      cluster_id: master.cluster_id,
      recentActivity: 'Master node updated',
      alerts: master.fill_level > 80 ? 'Full' : null,
    });

    data.slave_nodes.forEach(slave => {
      newBins.push({
        binId: slave.bin_id,
        timestamp: slave.timestamp,
        fill_level: slave.fill_level,
        battery: slave.battery,
        signal_strength: slave.signal_strength,
        temperature: slave.temperature,
        humidity: slave.humidity,
        is_master: slave.is_master,
        master_id: slave.master_id,
        cluster_id: slave.cluster_id,
        recentActivity: 'Slave node updated',
        alerts: slave.fill_level > 80 ? 'Full' : null,
      });
    });
  } else if(data.binId) {
    newBins.push({
      ...data,
      recentActivity: 'Flat data updated',
      alerts: data.fill_level > 80 ? 'Full' : null,
    });
  } else {
      console.warn('Unknown data format:', data);
  }

  // Merge/update in-memory bins
  newBins.forEach(newBin => {
    const index = bins.findIndex(b => b.binId === newBin.binId);
    if (index >= 0) bins[index] = newBin;
    else bins.push(newBin);
  });

  res.json({ message: 'Bin data received and flattened' });
});

// 🔹 Endpoint for frontend to fetch all bins
app.get('/api/bins', (req, res) => {
  const flattenedBins = bins.map(b => ({
    binId: b.binId,
    timestamp: b.timestamp,
    fill_level: b.fill_level,
    battery: b.battery,
    signal_strength: b.signal_strength,
    temperature: b.temperature,
    humidity: b.humidity,
    is_master: b.is_master,
    master_id: b.master_id,
    cluster_id: b.cluster_id,
    recentActivity: b.recentActivity || null,
    alerts: b.alerts || null,
  }));
  res.json(flattenedBins);
});

// 🔹 Endpoint to receive commands from frontend
app.post('/api/send-command', (req, res) => {
  const { binId, command } = req.body;
  if (!pendingCommands[binId]) pendingCommands[binId] = [];
  pendingCommands[binId].push(command);
  console.log(`Command queued for ${binId}: ${command}`);
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

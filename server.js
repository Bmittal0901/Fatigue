const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming JSON
app.use(express.json());

// Log file path
const LOG_FILE = path.join(__dirname, 'log.csv');

// Serve index.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Save typing log
app.post('/save-log', (req, res) => {
  const { username, wpm, errorRate, avgIKI, kspc, backspaces } = req.body;

  if (!username || !wpm || !errorRate || !avgIKI || !kspc) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newRow = `${username},${wpm},${errorRate},${avgIKI},${kspc},${backspaces}\n`;
  const header = 'Username,WPM,Error Rate (%),Avg IKI (ms),KSPC,Backspaces\n';

  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, header + newRow, 'utf8');
  } else {
    fs.appendFileSync(LOG_FILE, newRow, 'utf8');
  }

  res.status(200).json({ message: 'Log saved successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Clear the log file
app.post('/clear-log', (req, res) => {
  const header = 'Username,WPM,Error Rate (%),Avg IKI (ms),KSPC,Backspaces\n';

  try {
    fs.writeFileSync(LOG_FILE, header, 'utf8');
    res.status(200).json({ message: 'Log file cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear log file' });
  }
});

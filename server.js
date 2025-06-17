const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const LOG_FILE = path.join(__dirname, 'log.csv');

app.use(express.static('public'));
app.use(express.json());

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

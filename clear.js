const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, 'log.csv');

const header = 'Username,WPM,Error Rate (%),Avg IKI (ms),KSPC,Backspaces\n';
fs.writeFileSync(LOG_FILE, header, 'utf8');
console.log('✅ log.csv cleared and header rewritten');

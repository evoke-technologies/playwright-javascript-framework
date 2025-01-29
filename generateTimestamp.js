const moment = require('moment');
const { writeFileSync, existsSync } = require('fs');

const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
const filePath = 'timestamp.txt';

try {
  writeFileSync(filePath, timestamp);
  console.log(`Timestamp generated: ${timestamp}`);
} catch (err) {
  console.error(`Error writing timestamp to file: ${err.message}`);
  process.exit(1); 
}

if (!existsSync(filePath)) {
  console.error('Error: timestamp.txt file does not exist.');
  process.exit(1);
}

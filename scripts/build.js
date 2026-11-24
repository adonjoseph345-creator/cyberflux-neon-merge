const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'www/index.html',
  'www/style.css',
  'www/game.js',
  'www/manifest.json',
  'www/icon.svg',
  'capacitor.config.json'
];

let allPresent = true;
for (const rel of requiredFiles) {
  const fullPath = path.join(__dirname, '..', rel);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing required file: ${rel}`);
    allPresent = false;
  }
}

if (!allPresent) {
  process.exit(1);
}

console.log('✅ CyberFlux web bundle verified in ./www and ready for Capacitor Android sync.');


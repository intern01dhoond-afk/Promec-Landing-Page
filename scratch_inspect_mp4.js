const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.mp4'));

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  const buf = fs.readFileSync(filePath);
  const size = buf.length;
  
  let moovOffset = -1;
  let mdatOffset = -1;
  
  for (let i = 0; i < buf.length - 8; i++) {
    const type = buf.toString('ascii', i + 4, i + 8);
    if (type === 'moov' && moovOffset === -1) moovOffset = i;
    if (type === 'mdat' && mdatOffset === -1) mdatOffset = i;
  }
  
  console.log(`${file}:`);
  console.log(`  Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  moov offset: ${moovOffset}, mdat offset: ${mdatOffset}`);
  console.log(`  moov before mdat (FastStart): ${moovOffset < mdatOffset ? 'YES' : 'NO - CRITICAL ISSUE!'}`);
});

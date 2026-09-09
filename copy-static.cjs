const fs = require('fs');
const path = require('path');

const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(`[copy-static] Copied folder ${src} -> ${dest}`);
};

const copyFile = (src, dest) => {
  if (!fs.existsSync(src)) return;
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`[copy-static] Copied file ${src} -> ${dest}`);
};

copyDir('vendor', 'dist/vendor');
copyDir('assets', 'dist/assets');
copyFile('slater-custom.js', 'dist/slater-custom.js');
copyFile('main.js', 'dist/main.js');
copyFile('promec-logo.svg', 'dist/promec-logo.svg');
copyFile('slater-custom.css', 'dist/slater-custom.css');
copyFile('custom-enhancements.css', 'dist/custom-enhancements.css');
copyFile('webflow-core.css', 'dist/webflow-core.css');
console.log('[copy-static] Static files copied successfully.');

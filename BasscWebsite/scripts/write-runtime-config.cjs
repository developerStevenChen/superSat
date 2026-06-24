/**
 * Write dist/runtime-config.js from env at container start.
 * Railway: set VITE_API_BASE_URL on superSat_FE — takes effect on redeploy/restart without rebuild cache issues.
 */
const fs = require('fs');
const path = require('path');

const raw = (process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || '').trim();
let origin = raw.replace(/\/api\/?$/, '').replace(/\/$/, '');
if (origin && !origin.startsWith('http://') && !origin.startsWith('https://') && origin.includes('.')) {
  origin = `https://${origin}`;
}
const distDir = path.join(__dirname, '..', 'dist');
const outFile = path.join(distDir, 'runtime-config.js');
const content = `window.__RUNTIME_CONFIG__=${JSON.stringify({ API_ORIGIN: origin })};\n`;

if (!fs.existsSync(distDir)) {
  console.warn('[runtime-config] dist/ not found — skip (run npm run build first)');
  process.exit(0);
}

fs.writeFileSync(outFile, content, 'utf8');
console.log('[runtime-config] API_ORIGIN =', origin || '(empty — set VITE_API_BASE_URL on Railway)');

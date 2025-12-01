import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Suppress the baseline-browser-mapping stale data warning by patching dist files

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = [
  path.join(__dirname, '../node_modules/baseline-browser-mapping/dist/index.js'),
  path.join(__dirname, '../node_modules/baseline-browser-mapping/dist/index.cjs')
];

try {
  for (const file of files) {
    if (!fs.existsSync(file)) {
      continue;
    }

    let content = fs.readFileSync(file, 'utf8');
    const before = content.length;
    
    // Replace the entire timestamp check condition with false
    // This handles multiple variations of how it might be formatted
    content = content.replace(/\d{13}<\(new Date\)\.setMonth\(\(new Date\)\.getMonth\(\)-2\)/g, 'false');
    
    // Also try to catch it if the formatting is slightly different
    content = content.replace(/&&console\.warn\("\[baseline-browser-mapping\][^"]*ensure accurate[^"]*"\)/g, '&&false');
    
    if (content.length !== before) {
      fs.writeFileSync(file, content, 'utf8');
    }
  }
} catch (error) {
  // Silently ignore - this is just a quality-of-life improvement
}

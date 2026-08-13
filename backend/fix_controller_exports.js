import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/controllers/activityController.js',
  'src/controllers/bidController.js',
  'src/controllers/driverController.js'
];

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace: module.exports = { -> export {
    content = content.replace(/module\.exports\s*=\s*\{/g, 'export {');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed exports in ${file}`);
  }
}

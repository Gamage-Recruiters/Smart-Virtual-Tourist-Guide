import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/services/bookingService.js',
  'src/utills/logger.js'
];

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace: module.exports = { -> export {
    content = content.replace(/module\.exports\s*=\s*\{/g, 'export {');
    // Replace: module.exports = logger; -> export default logger;
    content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, 'export default $1;');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed exports in ${file}`);
  }
}

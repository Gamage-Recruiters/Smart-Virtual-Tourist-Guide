import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/controllers/activityController.js',
  'src/controllers/bidController.js',
  'src/controllers/bookingController.js',
  'src/controllers/driverController.js'
];

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace: exports.functionName = async (req, res, next) => {
    // With: export const functionName = async (req, res, next) => {
    content = content.replace(/exports\.([a-zA-Z0-9_]+)\s*=/g, 'export const $1 =');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

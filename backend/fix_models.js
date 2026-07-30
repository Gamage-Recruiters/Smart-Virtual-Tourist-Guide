import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/models/Booking.js',
  'src/models/activity.js',
  'src/models/bid.js',
  'src/models/driver.js'
];

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace: export default mongoose.model(; -> export default mongoose.model(
    content = content.replace(/export default mongoose\.model\(;/g, 'export default mongoose.model(');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}

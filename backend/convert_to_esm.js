import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/controllers/activityController.js',
  'src/controllers/bidController.js',
  'src/controllers/bookingController.js',
  'src/controllers/driverController.js',
  'src/models/Booking.js',
  'src/models/activity.js',
  'src/models/bid.js',
  'src/models/driver.js',
  'src/routes/activityRouter.js',
  'src/routes/bidRouter.js',
  'src/routes/bookingRoutes.js',
  'src/routes/dashboardRoutes.js',
  'src/routes/driverRouter.js'
];

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace: const name = require('module'); -> import name from 'module';
    content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g, (match, p1, p2) => {
        // if local import, add .js
        if (p2.startsWith('.')) {
            if (!p2.endsWith('.js')) {
                p2 += '.js';
            }
        }
        return `import ${p1} from '${p2}';`;
    });

    // Replace: const { name, name2 } = require('module'); -> import { name, name2 } from 'module';
    content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\);?/g, (match, p1, p2) => {
        // if local import, add .js
        if (p2.startsWith('.')) {
            if (!p2.endsWith('.js')) {
                p2 += '.js';
            }
        }
        return `import { ${p1.trim()} } from '${p2}';`;
    });

    // Replace: module.exports = name; -> export default name;
    content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_\.\(\)]+);?/g, 'export default $1;');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

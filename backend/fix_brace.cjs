const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'models');
const filesToUpdate = [
  'ActivityBooking.js',
  'DriverBooking.js',
  'GuideBooking.js',
  'HotelBooking.js',
  'RestaurantBooking.js',
  'VehicleBooking.js'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(modelsDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace double closing braces for payment block
    // The previous script resulted in:
    //     },
    //     },
    //     status: {
    
    content = content.replace(/\},\s*\},/g, '},');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax in ${file}`);
  }
});

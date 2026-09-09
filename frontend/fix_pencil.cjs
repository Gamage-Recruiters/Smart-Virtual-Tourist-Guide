const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Deatils.jsx', 'utf8');

const targetButton = '<button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">';
const replacementButton = '<button type="button" onClick={() => setIsEditing(!isEditing)} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">';

content = content.replace(targetButton, replacementButton);

fs.writeFileSync('src/components/bidding/Driver_Deatils.jsx', content);

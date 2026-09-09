const fs = require('fs');

const fallbackIcon = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

['src/components/bidding/Driver_Dashboard.jsx', 'src/components/bidding/Driver_Request.jsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/"https:\/\/images\.unsplash\.com\/photo-1539571696357-5a69c17a67c6\?auto=format&fit=crop&q=80&w=100"/g, `"${fallbackIcon}"`);
  fs.writeFileSync(file, content);
});

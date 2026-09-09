const fs = require('fs');

let content = fs.readFileSync('src/components/header.jsx', 'utf8');

// Add handleProfileClick
const handleProfileClickCode = `  const handleProfileClick = () => {
    if (!user) return;
    if (user.role === 'driver_user') navigate('/driver-details');
    else if (user.role === 'tourist_user') navigate('/touristProfile');
    else if (user.role === 'hotelowner_user') navigate('/hotelowner-dashboard');
    else if (user.role === 'restaurant_user') navigate('/restaurant-dashboard');
    else if (user.role === 'guide_user') navigate('/guide-dashboard');
    else if (user.role === 'renter_user') navigate('/renter-dashboard');
  };
`;

content = content.replace('  const handleNavigation = (path) => {', handleProfileClickCode + '\n  const handleNavigation = (path) => {');

// Update the user name box to be clickable
const targetBox = '<div className="px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#0075FF] font-bold rounded-lg text-sm flex items-center gap-1.5 shadow-sm">';
const replacementBox = '<div onClick={handleProfileClick} className="cursor-pointer px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#0075FF] font-bold rounded-lg text-sm flex items-center gap-1.5 shadow-sm hover:bg-blue-100 transition-colors">';

content = content.replace(targetBox, replacementBox);

// Do the same for mobile sidebar
const targetMobileBox = '<span className="text-[#0075FF] font-bold text-sm">\n                  {user.fullName || user.restaurantName || user.username || \'User\'}\n                </span>';
const replacementMobileBox = '<span onClick={handleProfileClick} className="cursor-pointer hover:underline text-[#0075FF] font-bold text-sm">\n                  {user.fullName || user.restaurantName || user.username || \'User\'}\n                </span>';
content = content.replace(targetMobileBox, replacementMobileBox);

fs.writeFileSync('src/components/header.jsx', content);

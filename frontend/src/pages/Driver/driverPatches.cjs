/**
 * Consolidated Driver Patches Script
 * Combines all individual .cjs patch scripts into one clean file inside src/pages/Driver.
 */

const fs = require('fs');
const path = require('path');

function applyAllDriverPatches() {
  console.log("Starting consolidated Driver patches execution...");

  // 1. Patch Driver Dashboard (Driver_Dashboard.jsx)
  try {
    const dashboardPath = path.resolve(__dirname, '../../components/Driver/Driver_Dashboard.jsx');
    if (fs.existsSync(dashboardPath)) {
      let content = fs.readFileSync(dashboardPath, 'utf8');

      if (!content.includes('const [hasNewRequest, setHasNewRequest]')) {
        content = content.replace(
          'const [isAvailable, setIsAvailable] = useState(true);',
          'const [hasNewRequest, setHasNewRequest] = useState(false);\n  const [isAvailable, setIsAvailable] = useState(true);'
        );
      }

      if (!content.includes('setHasNewRequest(')) {
        content = content.replace(
          'setPassengers(uniqueCustomers);\n        }',
          "setPassengers(uniqueCustomers);\n          setHasNewRequest(pData.bookings.some(b => b.status === 'pending'));\n        }"
        );
      }

      content = content.replace(
        /<h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide flex items-center justify-center gap-4">\s*Welcome Mendaka !\s*<button[\s\S]*?<\/button>\s*<\/h1>/,
        `<h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide flex items-center justify-center gap-4">
            Welcome {userData.fullName || userData.name || "Driver"} !
          </h1>`
      );

      content = content.replace(
        /Explore More\.\.\.\s*<span className="absolute -top-2 -right-2 bg-red-500 text-white text-\[10px\] font-bold px-2 py-1 rounded-full animate-bounce">\s*New Request\s*<\/span>/,
        `Explore More...
            {hasNewRequest && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                New Request
              </span>
            )}`
      );

      fs.writeFileSync(dashboardPath, content, 'utf8');
      console.log("✓ Driver_Dashboard.jsx patched.");
    }
  } catch (err) {
    console.error("Error patching Driver_Dashboard.jsx:", err.message);
  }

  // 2. Patch Driver Details (Driver_Deatils.jsx)
  try {
    const detailsPath = path.resolve(__dirname, '../../components/Driver/Driver_Deatils.jsx');
    if (fs.existsSync(detailsPath)) {
      let content = fs.readFileSync(detailsPath, 'utf8');

      if (!content.includes('userAPI')) {
        content = content.replace(
          'import React, { useState } from "react";',
          'import React, { useState, useEffect } from "react";\nimport { userAPI } from "../../services/api";'
        );
      }

      if (!content.includes('isEditing')) {
        content = content.replace(
          'const [loading, setLoading] = useState(false);',
          'const [loading, setLoading] = useState(false);\n  const [isEditing, setIsEditing] = useState(false);\n  const [profileImage, setProfileImage] = useState(null);\n  const [previewImage, setPreviewImage] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop");'
        );
      }

      fs.writeFileSync(detailsPath, content, 'utf8');
      console.log("✓ Driver_Deatils.jsx patched.");
    }
  } catch (err) {
    console.error("Error patching Driver_Deatils.jsx:", err.message);
  }

  // 3. Patch Driver Request (Driver_Request.jsx)
  try {
    const requestPath = path.resolve(__dirname, '../../components/Driver/Driver_Request.jsx');
    if (fs.existsSync(requestPath)) {
      let content = fs.readFileSync(requestPath, 'utf8');

      const targetPhoneInput = 'value={request?.customer?.phone || ""}';
      const replacePhoneInput = 'value={request?.customer?.contactNumber || request?.customer?.phone || ""}';
      if (content.includes(targetPhoneInput)) {
        content = content.replace(targetPhoneInput, replacePhoneInput);
      }

      fs.writeFileSync(requestPath, content, 'utf8');
      console.log("✓ Driver_Request.jsx patched.");
    }
  } catch (err) {
    console.error("Error patching Driver_Request.jsx:", err.message);
  }

  // 4. Patch Header (header.jsx)
  try {
    const headerPath = path.resolve(__dirname, '../../components/header.jsx');
    if (fs.existsSync(headerPath)) {
      let content = fs.readFileSync(headerPath, 'utf8');
      if (!content.includes('handleProfileClick')) {
        const handleProfileClickCode = `  const handleProfileClick = () => {
    if (!user) return;
    if (user.role === 'driver_user') navigate('/driver-details');
    else if (user.role === 'tourist_user') navigate('/touristProfile');
    else if (user.role === 'hotelowner_user') navigate('/hotelowner-dashboard');
    else if (user.role === 'restaurant_user') navigate('/restaurant-dashboard');
    else if (user.role === 'guide_user') navigate('/guide-dashboard');
    else if (user.role === 'renter_user') navigate('/renter-dashboard');
  };\n`;
        content = content.replace('  const handleNavigation = (path) => {', handleProfileClickCode + '\n  const handleNavigation = (path) => {');
        fs.writeFileSync(headerPath, content, 'utf8');
        console.log("✓ header.jsx patched.");
      }
    }
  } catch (err) {
    console.error("Error patching header.jsx:", err.message);
  }

  console.log("Driver patches execution completed successfully.");
}

if (require.main === module) {
  applyAllDriverPatches();
}

module.exports = { applyAllDriverPatches };

const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Deatils.jsx', 'utf8');

// 1. Add useEffect and userAPI import if missing
if (!content.includes('userAPI')) {
  content = content.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";\nimport { userAPI } from "../../services/api";');
}

// 2. Add isEditing state
content = content.replace(
  'const [loading, setLoading] = useState(false);',
  'const [loading, setLoading] = useState(false);\n  const [isEditing, setIsEditing] = useState(false);'
);

// 3. Add useEffect hook
const useEffectCode = `
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        const user = response?.user || response?.data?.user || response?.data || response;
        if (user && user.role) {
          setDriverName(user.fullName || "");
          setVehicleName(user.vehicleType || "");
          setVehicleNumber(user.vehicleNumber || "");
          setVehicleColor(user.vehicleColor || "");
          setNationalIdNumber(user.nationalIdNumber || user.licenseNumber || "");
          setContactNumber(user.contactNumber || "");
        }
      } catch (error) {
        console.error("Error fetching driver details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, []);

  const handleSaveDriverDetails = async () => {`;

content = content.replace('  const handleSaveDriverDetails = async () => {', useEffectCode);

// 4. Update handleSaveDriverDetails to handle isEditing
content = content.replace(
  '  const handleSaveDriverDetails = async () => {\n    if (\n      !driverName ||',
  '  const handleSaveDriverDetails = async () => {\n    if (!isEditing) {\n      setIsEditing(true);\n      return;\n    }\n\n    if (\n      !driverName ||'
);

content = content.replace(
  '    } finally {\n      setLoading(false);\n    }',
  '    } finally {\n      setLoading(false);\n      setIsEditing(false);\n    }'
);

// 5. Update input fields to be readOnly and style them
const inputRegex = /<input\s+type="text"\s+placeholder="([^"]+)"\s+value=\{([^}]+)\}\s+onChange=\{([^}]+)\}\s+className="([^"]+)"\s+\/>/g;

content = content.replace(inputRegex, (match, p1, p2, p3, p4) => {
  return `<input
                  type="text"
                  placeholder="${p1}"
                  value={${p2}}
                  onChange={${p3}}
                  readOnly={!isEditing}
                  className={\`w-full \${!isEditing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'} border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-blue-500 text-center\`}
                />`;
});

// 6. Update the "Edit your details" button text
content = content.replace(
  '{loading ? "Saving..." : "Edit your details"}',
  '{loading ? "Saving..." : isEditing ? "Save your details" : "Edit your details"}'
);

fs.writeFileSync('src/components/bidding/Driver_Deatils.jsx', content);

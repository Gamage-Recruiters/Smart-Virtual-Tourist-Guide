const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Deatils.jsx', 'utf8');

// 1. Add profileImage state
content = content.replace(
  'const [isEditing, setIsEditing] = useState(false);',
  'const [isEditing, setIsEditing] = useState(false);\n  const [profileImage, setProfileImage] = useState(null);\n  const [previewImage, setPreviewImage] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop");'
);

// 2. Set profile image if user object has one
content = content.replace(
  'setDriverName(user.fullName || "");',
  'setDriverName(user.fullName || "");\n          if (user.profileImage || user.image) setPreviewImage(user.profileImage || user.image);'
);

// 3. handleImageChange
const imageChangeCode = `
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setIsEditing(true); // auto switch to editing mode
    }
  };

  const handleSaveDriverDetails = async () => {`;

content = content.replace('  const handleSaveDriverDetails = async () => {', imageChangeCode);

// 4. Update avatar HTML
const targetAvatar = `<div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <FaUser className="text-4xl text-blue-300" />
                </div>
                <button type="button" onClick={() => setIsEditing(!isEditing)} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                  ✏️
                </button>`;

const replaceAvatar = `<div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative">
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" title="Update Profile Picture" />
                </div>
                <button type="button" onClick={() => setIsEditing(!isEditing)} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                  ✏️
                </button>`;

content = content.replace(targetAvatar, replaceAvatar);

fs.writeFileSync('src/components/bidding/Driver_Deatils.jsx', content);

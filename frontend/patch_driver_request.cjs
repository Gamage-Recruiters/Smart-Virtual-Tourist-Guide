const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Request.jsx', 'utf8');

// 1. Replace hardcoded avatar with customer's avatar
const targetAvatar = '<img src="https://cdn3d.iconscout.com/3d/premium/thumb/pilot-4996168-4159588.png" alt="Driver" className="w-24 h-24 object-contain drop-shadow-md" />';
const replaceAvatar = '<img src={request?.customer?.profileImage || request?.customer?.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150"} alt="Customer" className="w-full h-full object-cover" />';
content = content.replace(targetAvatar, replaceAvatar);

// 2. Also remove the bg-[#E14335] padding trick if we want full cover, wait, let's keep it but remove w-24 h-24
const targetContainer = '<div className="w-32 h-32 bg-[#E14335] rounded-full flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">';
const replaceContainer = '<div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">';
content = content.replace(targetContainer, replaceContainer);

// 3. Update contact number binding
const targetPhoneInput = 'value={request?.customer?.phone || ""}';
const replacePhoneInput = 'value={request?.customer?.contactNumber || request?.customer?.phone || ""}';
content = content.replace(targetPhoneInput, replacePhoneInput);

fs.writeFileSync('src/components/bidding/Driver_Request.jsx', content);

const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Request.jsx', 'utf8');

const targetAvatar = '<img src={request?.customer?.profileImage || request?.customer?.image || ""} alt="Customer" className="w-full h-full object-cover" />';
const replaceAvatar = `{request?.customer?.profileImage || request?.customer?.image ? (
                  <img src={request?.customer?.profileImage || request?.customer?.image} alt="Customer" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-6xl text-slate-400" />
                )}`;

if (content.includes(targetAvatar)) {
  content = content.replace(targetAvatar, replaceAvatar);
} else {
  // Try matching the original unsplash link if the previous script failed
  const targetAvatar2 = '<img src={request?.customer?.profileImage || request?.customer?.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150"} alt="Customer" className="w-full h-full object-cover" />';
  content = content.replace(targetAvatar2, replaceAvatar);
}

fs.writeFileSync('src/components/bidding/Driver_Request.jsx', content);

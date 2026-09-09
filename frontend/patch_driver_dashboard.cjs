const fs = require('fs');

let content = fs.readFileSync('src/components/bidding/Driver_Dashboard.jsx', 'utf8');

// 1. Add hasNewRequest state
content = content.replace(
  'const [isAvailable, setIsAvailable] = useState(true);',
  'const [hasNewRequest, setHasNewRequest] = useState(false);\n  const [isAvailable, setIsAvailable] = useState(true);'
);

// 2. Set hasNewRequest in fetchData
content = content.replace(
  'setPassengers(uniqueCustomers);\n        }',
  'setPassengers(uniqueCustomers);\n          setHasNewRequest(pData.bookings.some(b => b.status === \'pending\'));\n        }'
);

// 3. Fix welcome message and remove pencil
const targetWelcome = `<h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide flex items-center justify-center gap-4">
            Welcome Mendaka !
            <button 
              onClick={() => navigate('/driver-details')}
              className="text-sm bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors shadow-sm"
              title="Edit Profile"
            >
              ✏️
            </button>
          </h1>`;

const replaceWelcome = `<h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide flex items-center justify-center gap-4">
            Welcome {userData.fullName || userData.name || "Driver"} !
          </h1>`;

content = content.replace(targetWelcome, replaceWelcome);

// 4. Fix Explore More... button badge
const targetBadge = `<span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
              New Request
            </span>`;

const replaceBadge = `{hasNewRequest && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                New Request
              </span>
            )}`;

content = content.replace(targetBadge, replaceBadge);

fs.writeFileSync('src/components/bidding/Driver_Dashboard.jsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/bidding/Driver_Dashboard.jsx', 'utf8');

// 1. Add hasNewRequest state
if (!content.includes('const [hasNewRequest, setHasNewRequest]')) {
  content = content.replace(
    'const [isAvailable, setIsAvailable] = useState(true);',
    'const [hasNewRequest, setHasNewRequest] = useState(false);\n  const [isAvailable, setIsAvailable] = useState(true);'
  );
}

// 2. Set hasNewRequest
if (!content.includes('setHasNewRequest(')) {
  content = content.replace(
    'setPassengers(uniqueCustomers);\n        }',
    'setPassengers(uniqueCustomers);\n          setHasNewRequest(pData.bookings.some(b => b.status === \'pending\'));\n        }'
  );
}

// 3. Fix Welcome Message and remove pencil
// Using regex to match the exact block safely
content = content.replace(/<h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide flex items-center justify-center gap-4">\s*Welcome Mendaka !\s*<button[\s\S]*?<\/button>\s*<\/h1>/,
`<h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-sm mb-4 tracking-wide flex items-center justify-center gap-4">
            Welcome {userData.fullName || userData.name || "Driver"} !
          </h1>`);

// 4. Conditional Explore badge
content = content.replace(/Explore More\.\.\.\s*<span className="absolute -top-2 -right-2 bg-red-500 text-white text-\[10px\] font-bold px-2 py-1 rounded-full animate-bounce">\s*New Request\s*<\/span>/,
`Explore More...
            {hasNewRequest && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                New Request
              </span>
            )}`);

fs.writeFileSync('src/components/bidding/Driver_Dashboard.jsx', content);

/**
 * Rule-Based Chatbot Knowledge Base
 * 
 * Each rule has:
 * - id:       Unique identifier
 * - keywords: Array of trigger words (matched against lowercased user message)
 * - priority: Higher = checked first when multiple rules match equally
 * - response: The bot's response text (supports \n for line breaks)
 */

const CHATBOT_RULES = [
  {
    id: 'emergency_numbers',
    keywords: ['emergency', 'police', 'ambulance', 'fire', '119', '1990', '110', 'call', 'dial', 'number', 'hotline', '1912'],
    priority: 10,
    response: `🚨 Sri Lanka Emergency Numbers:

• Police: 119
• Ambulance (Suwa Seriya): 1990 — Free 24/7 service
• Fire & Rescue: 110
• Tourist Police: 0112-426800
• Tourism Hotline: 1912
• Accident Service (Colombo): 011-2691111

All numbers are toll-free and available 24 hours a day, 7 days a week. You can dial them from any phone — local or international.

💡 Tip: Save these numbers in your phone before travelling.`,
  },

  {
    id: 'medical_help',
    keywords: ['hospital', 'doctor', 'sick', 'injured', 'medicine', 'pharmacy', 'health', 'medical', 'clinic', 'pain', 'fever', 'allergy', 'bite', 'sting', 'dengue', 'malaria'],
    priority: 9,
    response: `🏥 Medical Help in Sri Lanka:

If this is a medical emergency, call 1990 (Suwa Seriya) immediately — it's a FREE 24/7 ambulance service across Sri Lanka.

Finding Care:
• Government hospitals are free for everyone (including tourists)
• Private hospitals offer faster service (Asiri, Lanka, Nawaloka in Colombo)
• Pharmacies are widely available — look for green cross signs

Common Precautions:
• Drink bottled or boiled water only
• Use insect repellent to prevent dengue (no vaccine available)
• Bring any prescription medications you need from home
• Carry a basic first-aid kit when travelling outside cities

📍 Use the hospital map above to find the nearest facility to your location!`,
  },

  {
    id: 'lost_passport',
    keywords: ['passport', 'embassy', 'consulate', 'lost document', 'visa', 'immigration', 'identity', 'id card'],
    priority: 9,
    response: `🛂 Lost Passport — What To Do:

Step 1: File a police report immediately
• Go to the nearest police station or call 119
• Get a copy of the report — you'll need it for your embassy

Step 2: Contact your embassy or consulate
• Most embassies are located in Colombo (Galle Road area)
• They can issue an Emergency Travel Certificate

Step 3: Visit the Department of Immigration
• Address: "Suhurupaya", Sri Subhutipura Road, Battaramulla
• Bring: police report + embassy letter + passport photos

Important Tips:
• Keep digital copies of your passport on your phone/email
• Your embassy can help even outside business hours for emergencies
• The Tourism Hotline (1912) can guide you through the process in English`,
  },

  {
    id: 'scam_awareness',
    keywords: ['scam', 'cheat', 'fraud', 'rip off', 'overcharge', 'trick', 'fake', 'con', 'suspicious', 'trust'],
    priority: 8,
    response: `⚠️ Common Tourist Scams in Sri Lanka:

1. Tuk-Tuk Overcharging
   • Always negotiate the fare BEFORE getting in
   • Use the PickMe app for metered, fair-priced rides
   • Short city rides should be Rs 100–300

2. Gem Shop Scams
   • Strangers may invite you to "special" gem deals
   • Never buy gems from street sellers or strangers
   • Only buy from certified dealers (ask for NGB certificate)

3. Fake Tour Guides
   • At popular sites, unofficial guides may pressure you
   • Use guides from registered agencies or your hotel

4. "Closed" Temple Trick
   • Someone tells you the attraction is closed, then redirects you to a shop
   • Always verify directly — walk to the entrance yourself

5. Currency Exchange
   • Only exchange money at banks or licensed dealers
   • Avoid street money changers

📞 Report scams to Tourist Police: 0112-426800`,
  },

  {
    id: 'transport_safety',
    keywords: ['taxi', 'tuk-tuk', 'tuk tuk', 'uber', 'transport', 'bus', 'train', 'pickme', 'drive', 'car', 'ride', 'travel', 'getting around'],
    priority: 7,
    response: `🚕 Safe Transportation in Sri Lanka:

Recommended Options:
• PickMe App — Sri Lanka's top ride-hailing app (like Uber), metered fares
• Uber — Available in Colombo and some major cities
• Hotel-arranged transport — Most reliable for long distances

Tuk-Tuk Tips:
• Fun and cheap, but ALWAYS agree on fare before riding
• Short trips: Rs 100–300 | Airport to Colombo: ~Rs 2500–3500
• Avoid tuk-tuks that approach you at tourist spots — they overcharge

Train Travel:
• Scenic and affordable (Kandy→Ella route is world-famous!)
• Book 1st class observation cars in advance for popular routes
• Keep valuables secure and don't hang out of doors

Bus Travel:
• Very cheap but can be crowded and fast
• Use intercity express buses for comfort
• Keep bags on your lap, not in overhead racks

🚗 Driving: International driving permit required. Drive on the LEFT side.`,
  },

  {
    id: 'beach_safety',
    keywords: ['beach', 'swim', 'swimming', 'ocean', 'sea', 'rip current', 'drown', 'surf', 'coast', 'wave', 'lifeguard', 'snorkel', 'dive'],
    priority: 7,
    response: `🌊 Beach Safety in Sri Lanka:

General Rules:
• Always swim at beaches with lifeguards on duty
• Look for red flags 🚩 — they mean NO swimming
• Yellow flags = swim with caution
• Green flags = safe to swim

Rip Currents:
• Very common, especially on the south and west coasts
• If caught: DON'T fight it — swim parallel to shore until free
• Signal for help by raising one arm

Seasonal Guide:
• West/South coast: Best for swimming Nov–April
• East coast: Best for swimming May–September
• Monsoon season = dangerous waves

Popular Safe Beaches:
• Unawatuna (south) — calm, sheltered bay
• Mirissa (south) — good for swimming & whale watching
• Pasikuda (east) — shallow, calm waters

⚠️ Never swim alone, at night, or after drinking alcohol.`,
  },

  {
    id: 'temple_etiquette',
    keywords: ['temple', 'buddha', 'buddhist', 'dress code', 'religion', 'worship', 'kovil', 'hindu', 'mosque', 'church', 'sacred', 'religious', 'shrine', 'tooth relic'],
    priority: 7,
    response: `🛕 Temple & Religious Site Etiquette:

Dress Code (Strictly Enforced):
• Cover shoulders and knees — no tank tops, shorts, or miniskirts
• Bring a sarong/shawl in your bag (can buy near temples for ~Rs 500)
• Some temples provide wraps at the entrance

Important Rules:
• Remove shoes before entering (socks are OK)
• Remove hats and sunglasses
• Never turn your back to a Buddha statue for photos
• Never pose with or touch Buddha statues
• Never point your feet towards a Buddha image or monks

Photography:
• Ask before photographing — some areas are restricted
• Never take selfies with Buddha statues (it's offensive & can be illegal)
• Flash photography is usually not allowed inside

Cultural Tips:
• Sit lower than monks — never sit on a higher seat
• Offer donations respectfully with both hands
• Full moon (Poya) days are public holidays — temples are very busy

📍 Must-visit: Temple of the Sacred Tooth Relic, Kandy`,
  },

  {
    id: 'food_water_safety',
    keywords: ['food', 'water', 'drink', 'eat', 'eating', 'diarrhea', 'stomach', 'restaurant', 'street food', 'spicy', 'vegetarian', 'vegan', 'halal', 'alcohol'],
    priority: 6,
    response: `🍛 Food & Water Safety:

Water:
• Do NOT drink tap water — always use bottled water
• Check that bottle seals are intact before buying
• Use bottled water even for brushing teeth in rural areas
• Ice in tourist restaurants is usually safe; avoid ice from street vendors

Food Tips:
• Sri Lankan food is delicious but very SPICY — ask for "less spicy" if needed
• Eat at busy restaurants (high turnover = fresh food)
• Street food is generally safe if it's freshly cooked in front of you
• Wash fruits before eating; peel when possible

If You Get Sick:
• Oral Rehydration Salts (ORS) — available at any pharmacy
• Drink plenty of bottled water
• Seek medical help if symptoms last more than 24 hours

Must-Try Sri Lankan Dishes:
• Rice & Curry (the staple meal)
• Kottu Roti (chopped roti stir-fry)
• Hoppers (bowl-shaped crispy pancakes)
• Fresh tropical fruits (mango, papaya, king coconut)

🍺 Alcohol: Available but expensive (high taxes). Legal drinking age is 21.`,
  },

  {
    id: 'weather_hazards',
    keywords: ['weather', 'rain', 'monsoon', 'flood', 'cyclone', 'storm', 'lightning', 'hot', 'sun', 'sunburn', 'humidity', 'climate', 'season'],
    priority: 6,
    response: `🌦️ Weather & Climate Safety:

Sri Lanka has TWO monsoon seasons:
• Southwest Monsoon: May – September (affects west & south coasts)
• Northeast Monsoon: October – January (affects east & north)

The "dry" side is usually great for travel during the other's monsoon.

Sun Safety:
• UV index is VERY high year-round (tropical location)
• Wear SPF 50+ sunscreen, reapply every 2 hours
• Wear a hat and sunglasses
• Stay hydrated — drink 2-3 liters of water daily
• Avoid midday sun (11am – 3pm)

Flood Safety:
• During monsoons, avoid low-lying areas and river banks
• Don't cross flooded roads — even shallow water can be dangerous
• Check weather alerts on this app before hiking

Lightning:
• Sri Lanka has high lightning risk during monsoons
• If caught outside: avoid open areas, trees, and water
• Seek shelter in a building or car

🌡️ Average temperature: 27–30°C (80–86°F) in coastal areas, cooler in hill country (15–20°C).`,
  },

  {
    id: 'wildlife_safety',
    keywords: ['animal', 'snake', 'monkey', 'elephant', 'leech', 'insect', 'spider', 'dog', 'stray', 'wildlife', 'safari', 'national park', 'crocodile', 'mosquito'],
    priority: 6,
    response: `🐘 Wildlife Safety in Sri Lanka:

Elephants:
• NEVER approach wild elephants — they can be aggressive
• Keep at least 30 meters distance on safari
• Don't feed elephants near roads
• Elephant crossings are marked — be alert while driving

Monkeys:
• Common at temples and tourist sites
• Don't feed them — they become aggressive
• Secure your belongings (they grab bags, phones, glasses!)

Snakes:
• Sri Lanka has venomous snakes (cobras, vipers, kraits)
• Watch your step on trails and in tall grass
• Wear closed shoes when hiking
• If bitten: stay calm, immobilize the limb, get to hospital FAST

Leeches:
• Very common in hill country during rainy season (Sinharaja, Knuckles)
• Wear leech socks and long pants
• Apply insect repellent on shoes and socks
• They're harmless but annoying — just pull them off

Mosquitoes:
• Use DEET-based repellent, especially at dawn and dusk
• Dengue is a risk — there's no vaccine, so prevention is key

🐕 Stray dogs: Common but usually harmless. Avoid touching them (rabies risk).`,
  },

  {
    id: 'theft_robbery',
    keywords: ['stolen', 'theft', 'rob', 'robbed', 'pickpocket', 'bag', 'wallet', 'phone', 'mugged', 'crime', 'safe', 'safety', 'dangerous', 'secure'],
    priority: 8,
    response: `🔒 Theft & Personal Safety:

If Something Is Stolen:
1. File a police report immediately (call 119 or visit nearest station)
2. Get a written copy of the report (needed for insurance claims)
3. Call Tourist Police for English-speaking assistance: 011-2421451
4. Contact your travel insurance provider within 24 hours

Prevention Tips:
• Use hotel safes for passports, extra cash, and valuables
• Carry a photocopy of your passport, not the original
• Use a cross-body bag or money belt in crowded areas
• Avoid displaying expensive jewelry or electronics
• Be extra careful at train stations, bus stands, and markets

Sri Lanka is generally SAFE for tourists, but petty theft can happen anywhere.

Areas to be Extra Careful:
• Colombo Fort & Pettah (crowded market areas)
• Busy train stations during rush hour
• Beach areas at night

📞 Tourist Police: 0112-426800 (English-speaking officers available)`,
  },

  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'help', 'what can you do', 'who are you', 'start', 'menu', 'options', 'assist'],
    priority: 1,
    response: `👋 Hello! I'm SafeBot, your Sri Lanka travel safety assistant!

I can help you with:

🚨 Emergency Numbers — All important contacts
🏥 Medical Help — Hospitals, pharmacies, health tips
🛂 Lost Passport — Step-by-step recovery guide
⚠️ Common Scams — How to stay safe from fraud
🚕 Transport Safety — Tuk-tuks, trains, ride apps
🌊 Beach Safety — Swimming, rip currents, seasons
🛕 Temple Etiquette — Dress codes & cultural rules
🍛 Food & Water — Safe eating & drinking tips
🌦️ Weather — Monsoons, sun safety, flood info
🐘 Wildlife — Elephants, snakes, leeches, mosquitoes
🔒 Theft Prevention — Keeping your belongings safe

Just type your question or tap one of the quick buttons below! 😊`,
  },
];

/**
 * Default response when no rule matches the user's message.
 */
const DEFAULT_RESPONSE = `I'm not sure I fully understand that question, but I'm here to help! 😊

Try asking me about:
• Emergency numbers
• Medical help or hospitals
• Lost passport steps
• Common tourist scams
• Safe transportation
• Beach or weather safety

Or tap one of the quick buttons below for instant answers!

📞 For urgent help, call the Tourism Hotline: 1912`;

/**
 * Quick suggestion chips shown below the chat.
 */
const QUICK_SUGGESTIONS = [
  { label: '🚨 Emergency', query: 'What are the emergency numbers?' },
  { label: '🏥 Medical', query: 'I need medical help' },
  { label: '🚕 Transport', query: 'How to travel safely?' },
  { label: '⚠️ Scams', query: 'What scams should I avoid?' },
  { label: '🛂 Passport', query: 'I lost my passport' },
  { label: '🌊 Beach', query: 'Is it safe to swim?' },
];

export { CHATBOT_RULES, DEFAULT_RESPONSE, QUICK_SUGGESTIONS };

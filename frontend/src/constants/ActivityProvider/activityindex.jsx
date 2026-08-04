import {
  MdTerrain,
  MdPets,
  MdPool,
  MdAccountBalance,
  MdSpa,
  MdRestaurant,
  MdCameraAlt,
} from 'react-icons/md';

export const CATEGORIES = [
  'Hiking & Adventure',
  'Safari',
  'Water Sports',
  'Cultural',
  'Wellness',
  'Food & Cuisine',
  'Sightseeing',
];

export const LOCATIONS = [
  'Sigiriya',
  'Yala National Park',
  'Galle',
  'Ella',
  'Kandy',
  'Colombo',
  'Weligama',
  'Mirissa',
  'Dambulla',
  'Nuwara Eliya',
];

export const DURATIONS = [
  '1 Hour', '2 Hours', '3 Hours', '4 Hours', 'Half Day', 'Full Day', '2 Days',
];

export const MAX_PARTICIPANTS_OPTIONS = [5, 6, 8, 10, 12, 15, 20, 25, 30];

export const EQUIPMENT_OPTIONS = [
  'Guide', 'Gear', 'Transport', 'Meals', 'Accommodation', 'Photography', 'First Aid',
];

export const CATEGORY_BG = {
  'Hiking & Adventure': '#eaf3de',
  'Safari':             '#faeeda',
  'Water Sports':       '#e6f1fb',
  'Cultural':           '#fbeaf0',
  'Wellness':           '#e1f5ee',
  'Food & Cuisine':     '#faece7',
  'Sightseeing':        '#eeedfe',
};

export const ICON_CLASS = 'text-xl';

export const CATEGORY_COLOR = {
  'Hiking & Adventure': '#2f855a', // green-600
  'Safari':             '#b7791f', // amber-600
  'Water Sports':       '#2b6cb0', // blue-600
  'Cultural':           '#9b2c63', // rose-700
  'Wellness':           '#059669', // emerald-600
  'Food & Cuisine':     '#c2410c', // orange-700
  'Sightseeing':        '#5b21b6', // indigo-700
};

export const CATEGORY_ICON = {
  'Hiking & Adventure': <MdTerrain className={ICON_CLASS} style={{ color: CATEGORY_COLOR['Hiking & Adventure'] }} />,
  'Safari':             <MdPets className={ICON_CLASS} style={{ color: CATEGORY_COLOR['Safari'] }} />,
  'Water Sports':       <MdPool className={ICON_CLASS} style={{ color: CATEGORY_COLOR['Water Sports'] }} />,
  'Cultural':           <MdAccountBalance className={ICON_CLASS} style={{ color: CATEGORY_COLOR['Cultural'] }} />,
  'Wellness':           <MdSpa className={ICON_CLASS} style={{ color: CATEGORY_COLOR['Wellness'] }} />,
  'Food & Cuisine':     <MdRestaurant className={ICON_CLASS} style={{ color: CATEGORY_COLOR['Food & Cuisine'] }} />,
  'Sightseeing':        <MdCameraAlt className={ICON_CLASS} style={{ color: CATEGORY_COLOR['Sightseeing'] }} />,
};

export const ICON_COLORS = {
  primary: '#2563eb', // blue-600
  muted: '#6b7280', // gray-500
  success: '#16a34a', // green-600
  publish: '#f97316', // orange-500
};

// extra semantic colors
ICON_COLORS.delete = '#dc2626'; // red-600
ICON_COLORS.upload = '#0891b2'; // cyan-600

export default null;

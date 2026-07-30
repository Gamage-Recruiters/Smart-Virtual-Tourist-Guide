import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaSearch, FaPlus, FaCloudUploadAlt,
  FaMapMarkerAlt, FaBold, FaItalic, FaUnderline,
  FaAddressCard, FaChevronDown, FaChevronLeft, FaChevronRight, FaBolt
} from 'react-icons/fa';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import addpackages from '../assets/add-special-packages-image.png';
import toproom from '../assets/toproom.png';
import specialPak from '../assets/specialPak.png';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function CardHeading({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
      <Icon className="text-yellow-400" />{children}
    </span>
  );
}

function PromoCodeInput({ code, setCode }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {code.map((char, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={char}
          onChange={(e) => {
            const next = [...code];
            next[i] = e.target.value.toUpperCase();
            setCode(next);
          }}
          className="w-7 h-8 text-center text-sm font-bold border border-slate-300 text-slate-700 focus:outline-none focus:border-blue-400"
        />
      ))}
    </div>
  );
}

const AMENITY_OPTIONS = [
  'Terrace', 'Garden View', 'Free WiFi', 'Air Conditions', 'Breakfast Included',
  'Swimming Pool', 'Room Service', 'Free Parking', 'Tea Coffee Maker',
];

export default function AddSpecialPackages() {
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(editId);
  const BASE_URL = 'http://localhost:5000';
  const [roomTypeOpen, setRoomTypeOpen] = useState(false);

  const [formData, setFormData] = useState({
    packageName: '',
    roomType: '',
    roomSize: '',
    measureType: '',
    capacityAdults: '',
    capacityChildren: '',
    description: '',
    contactName: '',
    contactNumber: '',
    email: '',
    aboutLocation: '',
    basePrice: '',
    paymentMethods: [],
    amenities: [],
  });

  const [customAmenities, setCustomAmenities] = useState([]);
  const [addingAmenity, setAddingAmenity] = useState(false);
  const [newAmenityValue, setNewAmenityValue] = useState('');
  const newAmenityInputRef = useRef(null);

  const [slotImages, setSlotImages] = useState([null, null, null, null]);
  const [slotFiles, setSlotFiles] = useState([null, null, null, null]);
  const slotInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (!editId) return;
    fetch(`${BASE_URL}/api/packages/${editId}`)
      .then((r) => r.json())
      .then(({ package: pkg }) => {
        if (!pkg) return;
        const pricing = pkg.locationAndPricing?.[0] || {};
        setFormData({
          packageName:      pkg.packageName || '',
          roomType:         pkg.roomType || '',
          roomSize:         pkg.roomSize ?? '',
          measureType:      pkg.measureType || '',
          capacityAdults:   pkg.capacity?.adults ?? '',
          capacityChildren: pkg.capacity?.children ?? '',
          description:      pkg.description || '',
          contactName:      pkg.contactInfo?.contactName || '',
          contactNumber:    pkg.contactInfo?.contactNumber || '',
          email:            pkg.contactInfo?.email || '',
          aboutLocation:    pricing.aboutLocation || '',
          basePrice:        pricing.basePrice ?? '',
          paymentMethods:   Array.isArray(pricing.paymentMethods) ? pricing.paymentMethods : (pricing.paymentMethods ? [pricing.paymentMethods] : []),
          amenities:        pkg.amenities || [],
        });
        if (pkg.discount) {
          if (pkg.discount.discountPercent != null) setDiscountPercent(pkg.discount.discountPercent);
          if (pkg.discount.promoCode) setPromoCode(pkg.discount.promoCode.padEnd(6, ' ').slice(0, 6).split(''));
          if (pkg.discount.validFrom || pkg.discount.validTo)
            setCalSel({ from: pkg.discount.validFrom || null, to: pkg.discount.validTo || null });
        }
        const imgs = (pkg.images || []).slice(0, 4);
        setSlotImages([null, null, null, null].map((_, i) =>
          imgs[i] ? (imgs[i].startsWith('http') ? imgs[i] : `${BASE_URL}${imgs[i]}`) : null
        ));
        const defaultLabels = ['Terrace','Garden View','Free WiFi','Air Conditions','Breakfast Included','Swimming Pool','Room Service','Free Parking','Tea Coffee Maker'];
        setCustomAmenities((pkg.amenities || []).filter(a => !defaultLabels.includes(a)));
      })
      .catch(() => {});
  }, [editId]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const FIELD_MAP = {
    'packageName': 'packageName',
    'roomType': 'roomType',
    'roomSize': 'roomSize',
    'measureType': 'measureType',
    'capacity.adults': 'capacityAdults',
    'capacity.children': 'capacityChildren',
    'description': 'description',
    'contactInfo.contactName': 'contactName',
    'contactInfo.contactNumber': 'contactNumber',
    'contactInfo.email': 'email',
    'locationAndPricing.0.basePrice': 'basePrice',
    'locationAndPricing.0.paymentMethods': 'paymentMethods',
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.packageName.trim())       errors.packageName = 'Package name is required.';
    if (!formData.roomType)                 errors.roomType = 'Please select a room type.';
    if (formData.roomSize === '' || formData.roomSize === null) errors.roomSize = 'Room size is required.';
    if (!formData.measureType)              errors.measureType = 'Measure type is required.';
    if (formData.capacityAdults === '')     errors.capacityAdults = 'Adults capacity is required.';
    if (formData.capacityChildren === '')   errors.capacityChildren = 'Children capacity is required.';
    if (!formData.description.trim())       errors.description = 'Description is required.';
    if (!formData.contactName.trim())       errors.contactName = 'Contact name is required.';
    if (!formData.contactNumber.trim())     errors.contactNumber = 'Contact number is required.';
    if (!formData.email.trim())             errors.email = 'Email is required.';
    if (formData.basePrice === '' || formData.basePrice === null) errors.basePrice = 'Base price is required.';
    if (!formData.paymentMethods.length)    errors.paymentMethods = 'Please select a payment method.';
    return errors;
  };

  const parseBackendErrors = (details = []) => {
    const errors = {};
    details.forEach(({ path, message }) => {
      const field = FIELD_MAP[path];
      if (field) errors[field] = message;
    });
    return errors;
  };

  const [discountPercent, setDiscountPercent] = useState(20);
  const [discountDescription, setDiscountDescription] = useState('Book now and enjoy an exclusive discount on your stay. Limited rooms available at this special rate.');
  const [promoCode, setPromoCode] = useState(['S', 'P', 'K', '2', '0', '5']);
  const [discountSaved, setDiscountSaved] = useState(false);

  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(2);
  // calSel stores full ISO strings so selection survives month navigation
  const [calSel, setCalSel] = useState({ from: null, to: null });

  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calStartDay = new Date(calYear, calMonth, 1).getDay();
  const calMonthLabel = new Date(calYear, calMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const toISO = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const discountFrom = calSel.from || '';
  const discountTo = calSel.to || '';

  const handleCalPrev = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const handleCalNext = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const handleDayClick = (day) => {
    const iso = toISO(calYear, calMonth, day);
    setDiscountSaved(false);
    setCalSel((prev) => {
      if (!prev.from || (prev.from && prev.to)) return { from: iso, to: null };
      if (iso === prev.from) return { from: null, to: null };
      if (iso < prev.from) return { from: iso, to: prev.from };
      return { from: prev.from, to: iso };
    });
  };

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    setPromoCode(Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (label) => {
    setFormData((prev) => {
      const current = [...prev.amenities];
      const index = current.indexOf(label);
      if (index > -1) current.splice(index, 1);
      else current.push(label);
      return { ...prev, amenities: current };
    });
  };

  const handleAddMoreClick = () => {
    setNewAmenityValue('');
    setAddingAmenity(true);
    setTimeout(() => newAmenityInputRef.current?.focus(), 0);
  };

  const handleNewAmenityKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = newAmenityValue.trim();
      if (trimmed) {
        setCustomAmenities((prev) => [...prev, trimmed]);
        setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
      }
      setAddingAmenity(false);
      setNewAmenityValue('');
    }
  };

  const handleSlotFile = (index, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setSlotImages((prev) => { const next = [...prev]; next[index] = url; return next; });
    setSlotFiles((prev) => { const next = [...prev]; next[index] = file; return next; });
  };

  const handleSlotDrop = (index, e) => {
    e.preventDefault();
    handleSlotFile(index, e.dataTransfer.files[0]);
  };

  const handleClear = () => {
    setFormData({
      packageName: '', roomType: '', roomSize: '', measureType: '',
      capacityAdults: '', capacityChildren: '', description: '',
      contactName: '', contactNumber: '', email: '',
      aboutLocation: '', basePrice: '', paymentMethods: [], amenities: [],
    });
    setSlotImages([null, null, null, null]);
    setSlotFiles([null, null, null, null]);
    setCustomAmenities([]);
    setSuccessMessage('');
    setErrorMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const hotelId = userData.hotels?.[0]?._id;
      const fd = new FormData();
      if (hotelId) fd.append('hotelId', hotelId);
      fd.append('packageName', formData.packageName);
      fd.append('roomType', formData.roomType);
      fd.append('roomSize', Number(formData.roomSize));
      fd.append('measureType', formData.measureType);
      fd.append('description', formData.description);
      fd.append('capacity', JSON.stringify({ adults: Number(formData.capacityAdults), children: Number(formData.capacityChildren) }));
      fd.append('amenities', JSON.stringify(formData.amenities));
      fd.append('contactInfo', JSON.stringify({ contactName: formData.contactName, contactNumber: formData.contactNumber, email: formData.email }));
      fd.append('locationAndPricing', JSON.stringify([{ aboutLocation: formData.aboutLocation, basePrice: Number(formData.basePrice), paymentMethods: formData.paymentMethods }]));
      fd.append('discount', JSON.stringify(
        discountSaved ? {
          discountPercent: discountPercent !== '' ? Number(discountPercent) : null,
          discountAmountPerNight: (formData.basePrice !== '' && discountPercent !== '') ? Number((Number(formData.basePrice) * Number(discountPercent) / 100).toFixed(2)) : null,
          validFrom: calSel.from || null,
          validTo: calSel.to || null,
          promoCode: promoCode.join('').trim() || null,
        } : {
          discountPercent: null,
          discountAmountPerNight: null,
          validFrom: null,
          validTo: null,
          promoCode: null,
        }
      ));
      const keptImages = [];
      slotFiles.forEach((file, i) => {
        if (file) {
          fd.append('images', file);
        } else if (slotImages[i]) {
          keptImages.push(slotImages[i]);
        }
      });
      if (isEditMode) fd.append('keptImages', JSON.stringify(keptImages));

      const url = isEditMode ? `${BASE_URL}/api/packages/${editId}` : `${BASE_URL}/api/packages`;
      const method = isEditMode ? 'PUT' : 'POST';
      const response = await fetch(url, { method, body: fd });
      const data = await response.json();
      if (!response.ok) {
        if (data.details) setFieldErrors(parseBackendErrors(data.details));
        throw new Error(data.message || 'Validation error.');
      }
      if (isEditMode) {
        setSuccessMessage('✅ Package updated successfully!');
        setTimeout(() => navigate('/view-rooms-packages'), 1500);
      } else {
        setSuccessMessage('🎉 Special package added successfully!');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed connecting to API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-white to-[#A0DBFF] min-h-screen pt-28">
      <Header />

      {/* HERO BANNER */}
      <section
        className="relative h-screen w-full flex flex-col items-center justify-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url(${addpackages})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 80%',
        }}
      >
        <div className="flex max-w-3xl flex-col items-start gap-9 w-full ml-[1px] mb-[250px]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Add Special Packages
          </h1>
          <p className="text-base md:text-2xl text-slate-800 font-medium">
            Fill in the Details to Create a New Special Package for <span className="font-bold">Your</span> Hotel!
          </p>
          <div className="relative w-full max-w-md shadow-md rounded-full">
            <input
              type="text"
              placeholder="Explore Packages"
              className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
            />
            <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          </div>
        </div>
      </section>

      {/* MAIN DASHBOARD */}
      <div className="max-w-[1450px] mx-auto px-4 md:px-8 pt-10 pb-16">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Add Special Package</h2>
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-10 text-sm">
          <main>
            {/* Header Indicator */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <img src={toproom} alt="Package" className="h-16 w-16 object-contain" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Package Details</h2>
            </div>

            {successMessage && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold">{successMessage}</div>}
            {errorMessage && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">{errorMessage}</div>}

            <form id="package-form" className="grid grid-cols-1 lg:grid-cols-2 gap-x-48 gap-y-8" onSubmit={handleSubmit}>

              {/* LEFT COLUMN */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Package Name *</label>
                  <input
                    type="text" name="packageName"
                    value={formData.packageName} onChange={handleChange}
                    placeholder="e.g., Summer Romantic Escape"
                    className={`w-full px-4 py-2.5 border text-sm text-slate-800 focus:ring-1 focus:outline-none ${fieldErrors.packageName ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-400'}`}
                  />
                  {fieldErrors.packageName && <p className="mt-1 text-xs text-red-500">{fieldErrors.packageName}</p>}
                </div>

                {/* Room Type Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Room Type</label>
                  <button
                    type="button" onClick={() => setRoomTypeOpen(!roomTypeOpen)}
                    className={`w-full text-left flex justify-between items-center px-4 py-2.5 border text-sm text-slate-600 bg-white ${fieldErrors.roomType ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <span className={formData.roomType ? 'text-slate-600' : 'text-slate-400'}>{formData.roomType || 'Select a room type'}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  {fieldErrors.roomType && <p className="mt-1 text-xs text-red-500">{fieldErrors.roomType}</p>}
                  {roomTypeOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg z-20 overflow-hidden">
                      {['Single Room','Double Room','Twin Room','Queen Room','King Room','Deluxe Double Room','Family Room / Quad Room'].map((type) => (
                        <div
                          key={type}
                          onClick={() => { setFormData(prev => ({...prev, roomType: type})); setRoomTypeOpen(false); }}
                          className={`px-4 py-2 text-sm cursor-pointer transition-colors ${formData.roomType === type ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Room Size, Measure, Capacity */}
                <div className="flex items-end gap-3">
                  <div className="w-32 shrink-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Room Size</label>
                    <input type="number" name="roomSize" value={formData.roomSize} onChange={handleChange} placeholder="35" className={`w-full px-2 py-2.5 border text-sm text-slate-600 bg-white focus:outline-none ${fieldErrors.roomSize ? 'border-red-500' : 'border-slate-300'}`} />
                    {fieldErrors.roomSize && <p className="mt-1 text-xs text-red-500">{fieldErrors.roomSize}</p>}
                  </div>
                  <div className="w-32 shrink-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Measure Type</label>
                    <select name="measureType" value={formData.measureType} onChange={handleChange} className={`w-full px-2 py-2.5 border text-sm text-slate-600 bg-white focus:outline-none ${fieldErrors.measureType ? 'border-red-500' : 'border-slate-300'}`}>
                      <option value="" disabled>Select</option>
                      <option value="sqm">sqm</option>
                      <option value="sqft">sqft</option>
                    </select>
                    {fieldErrors.measureType && <p className="mt-1 text-xs text-red-500">{fieldErrors.measureType}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Capacity</label>
                    <div className={`flex items-center border bg-white overflow-hidden ${fieldErrors.capacityAdults || fieldErrors.capacityChildren ? 'border-red-500' : 'border-slate-300'}`}>
                      <input type="number" name="capacityAdults" value={formData.capacityAdults} onChange={handleChange} placeholder="Adults" min="0" className="w-1/2 px-2 py-2.5 text-sm text-slate-600 bg-white focus:outline-none" />
                      <span className="w-px h-5 bg-slate-300 shrink-0" />
                      <input type="number" name="capacityChildren" value={formData.capacityChildren} onChange={handleChange} placeholder="Children" min="0" className="w-1/2 px-2 py-2.5 text-sm text-slate-600 bg-white focus:outline-none" />
                    </div>
                    {(fieldErrors.capacityAdults || fieldErrors.capacityChildren) && (
                      <p className="mt-1 text-xs text-red-500">{fieldErrors.capacityAdults || fieldErrors.capacityChildren}</p>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-slate-700">Select Amenities</label>
                    <button type="button" onClick={handleAddMoreClick} className="flex items-center gap-1.5 bg-sky-800 hover:bg-sky-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
                      <span className="text-white font-bold leading-none">+</span> Add more
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[...AMENITY_OPTIONS, ...customAmenities].map((label) => (
                      <label key={label} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                        <input type="checkbox" checked={formData.amenities.includes(label)} onChange={() => handleAmenityToggle(label)} className="w-3.5 h-3.5 accent-[#007bff] border-slate-300 rounded" />
                        {label}
                      </label>
                    ))}
                    {addingAmenity && (
                      <label className="flex items-center gap-2">
                        <input type="checkbox" disabled className="w-3.5 h-3.5 border-slate-300 rounded" />
                        <input ref={newAmenityInputRef} type="text" value={newAmenityValue} onChange={(e) => setNewAmenityValue(e.target.value)} onKeyDown={handleNewAmenityKeyDown} placeholder="Type amenity and press Enter" className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description of the Package</label>
                  <div className={`border overflow-hidden ${fieldErrors.description ? 'border-red-500' : 'border-slate-300'}`}>
                    <div className="flex items-center gap-4 px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                      <FaBold className="cursor-pointer" /> <FaItalic className="cursor-pointer" /> <FaUnderline className="cursor-pointer" />
                    </div>
                    <textarea rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full p-3 text-xs text-slate-600 leading-relaxed focus:outline-none resize-none" />
                  </div>
                  {fieldErrors.description && <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>}
                </div>

                {/* Contact Information */}
                <div className="rounded-[2px] bg-[#eaeaea] px-7 py-8 border border-transparent shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] space-y-8">
                  <div className="flex items-center gap-4 text-base font-bold text-slate-900">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm">
                      <FaAddressCard className="text-xs" />
                    </span>
                    <span>Contact Information</span>
                  </div>
                  <div className="space-y-7">
                    <div className="space-y-3">
                      <label className="block text-[11px] font-medium text-slate-900">Contact Name:</label>
                      <div className={`bg-white px-4 py-3 ${fieldErrors.contactName ? 'border border-red-500' : 'border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'}`}>
                        <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Enter contact name" className="w-full bg-transparent text-sm text-slate-500 placeholder-slate-400 focus:outline-none" />
                      </div>
                      {fieldErrors.contactName && <p className="text-xs text-red-500">{fieldErrors.contactName}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-medium text-slate-900">Contact Number</label>
                      <div className={`bg-white px-4 py-3 flex items-center gap-3 ${fieldErrors.contactNumber ? 'border border-red-500' : 'border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'}`}>
                        <span className="flex items-center gap-1 text-sm text-slate-500 shrink-0"><span className="text-base">🇱🇰</span><span>+94</span></span>
                        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter contact number" className="w-full bg-transparent text-sm text-slate-500 placeholder-slate-400 focus:outline-none" />
                      </div>
                      {fieldErrors.contactNumber && <p className="text-xs text-red-500">{fieldErrors.contactNumber}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-medium text-slate-900">Contact E mail:</label>
                      <div className={`bg-white px-4 py-3 ${fieldErrors.email ? 'border border-red-500' : 'border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'}`}>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter contact email" className="w-full bg-transparent text-sm text-slate-500 placeholder-slate-400 focus:outline-none" />
                      </div>
                      {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Location & Pricing */}
                <div className="rounded-[2px] bg-white border border-black px-7 py-8 space-y-8">
                  <div className="flex items-center justify-center gap-3 text-base font-bold text-slate-900">
                    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                      <FaMapMarkerAlt className="text-xs" />
                      <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-blue-600 border border-blue-200">$</span>
                    </span>
                    <span>Location &amp; Pricing</span>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[13px] font-medium text-slate-900">About the Location</label>
                    <textarea rows={4} name="aboutLocation" value={formData.aboutLocation} onChange={handleChange} placeholder="Describe the property location" className="w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 leading-relaxed focus:outline-none resize-none min-h-[124px]" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[13px] font-medium text-slate-900">Base Price (per night)</label>
                    <div className={`flex overflow-hidden border bg-white ${fieldErrors.basePrice ? 'border-red-500' : 'border-slate-300'}`}>
                      <div className="flex-1 px-4 py-3">
                        <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} placeholder="$150" className="w-full bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none" />
                      </div>
                      <div className="flex items-center gap-2 border-l border-slate-300 px-4 text-sm text-slate-500">
                        <span>USD</span><FaChevronDown className="text-xs" />
                      </div>
                    </div>
                    {fieldErrors.basePrice && <p className="text-xs text-red-500">{fieldErrors.basePrice}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[12px] font-medium text-slate-900">Payment Options</label>
                    <div className={`space-y-2.5 text-sm text-slate-500 ${fieldErrors.paymentMethods ? 'p-2 border border-red-500 rounded' : ''}`}>
                      {['Card Payment', 'Online Payment', 'Cash Payment(Pay at Hotel)'].map((option) => (
                        <label key={option} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods.includes(option)}
                            onChange={() => setFormData((prev) => {
                              const current = prev.paymentMethods.includes(option)
                                ? prev.paymentMethods.filter((m) => m !== option)
                                : [...prev.paymentMethods, option];
                              return { ...prev, paymentMethods: current };
                            })}
                            className="h-4 w-4 accent-[#007bff] border-slate-400 rounded"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {fieldErrors.paymentMethods && <p className="text-xs text-red-500">{fieldErrors.paymentMethods}</p>}
                  </div>
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500" />
                    <span>I agreed <span className="text-blue-600">Terms of Services</span> and <span className="text-blue-600">Privacy Policy</span></span>
                  </label>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Uploaded Room Images</label>
                    <div className="w-full max-w-[320px] h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
                      <img src={specialPak} alt="Uploaded package preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Add Images of the Room</label>
                    <div className="grid grid-cols-2 gap-4 max-w-[243px]">
                      {[0, 1, 2, 3].map((slot) => (
                        <div
                          key={slot}
                          className="relative w-28 h-28 border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 shadow-sm hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer overflow-hidden"
                          onClick={() => slotInputRefs[slot].current.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleSlotDrop(slot, e)}
                        >
                          {slotImages[slot] ? (
                            <>
                              <img src={slotImages[slot]} alt={`Package ${slot + 1}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={(e) => { e.stopPropagation(); setSlotImages((prev) => { const next = [...prev]; next[slot] = null; return next; }); setSlotFiles((prev) => { const next = [...prev]; next[slot] = null; return next; }); }} className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white w-4 h-4 flex items-center justify-center text-[10px] leading-none">✕</button>
                            </>
                          ) : (
                            <FaPlus className="text-sm" />
                          )}
                          <input ref={slotInputRefs[slot]} type="file" accept="image/*" className="hidden" onChange={(e) => handleSlotFile(slot, e.target.files[0])} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-sky-50/70 border border-sky-100 rounded-2xl px-6 py-7 text-center shadow-sm max-w-[500px]">
                    <FaCloudUploadAlt className="text-4xl text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800 mb-2">Drag &amp; Drop or Browse to upload the images</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Upload high quality images (.JPG, .PNG, .JPEG)<br />
                      Max Image size 5MB<br />
                      Recommended image size 1400px * 900px
                    </p>
                  </div>

                  {/* Available Dates of Valid Discount */}
                  <div className="mt-10">
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Available Dates of Valid Discount</label>
                    <div className="border border-slate-200 p-6 min-h-[320px]">
                      <div className="flex justify-between items-center text-sm font-bold text-slate-800 mb-4">
                        <span>{calMonthLabel}</span>
                        <div className="flex gap-2 text-slate-400">
                          <FaChevronLeft className="cursor-pointer hover:text-slate-600" onClick={handleCalPrev} />
                          <FaChevronRight className="cursor-pointer hover:text-slate-600" onClick={handleCalNext} />
                        </div>
                      </div>
                      <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
                        {WEEKDAYS.map((d) => <span key={d} className="py-1">{d}</span>)}
                      </div>
                      <div className="grid grid-cols-7 text-center text-sm gap-y-1">
                        {Array.from({ length: calStartDay }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: calDaysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const iso = toISO(calYear, calMonth, day);
                          const isFrom = calSel.from === iso;
                          const isTo = calSel.to === iso;
                          const inRange = calSel.from && calSel.to && iso > calSel.from && iso < calSel.to;
                          // pending: from picked, hovering before to is picked — highlight all of current month if only from is set
                          const isPending = calSel.from && !calSel.to && iso > calSel.from;
                          return (
                            <div
                              key={day}
                              onClick={() => handleDayClick(day)}
                              className={`py-2 cursor-pointer select-none transition-colors ${
                                isFrom || isTo
                                  ? 'bg-blue-600 text-white font-bold'
                                  : inRange
                                  ? 'bg-blue-100 text-blue-700 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                      {(calSel.from || calSel.to) && (
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                          <span>{calSel.from ? <><span className="font-semibold text-blue-600">From:</span> {calSel.from}</> : 'Pick start date'}</span>
                          <span>{calSel.to ? <><span className="font-semibold text-blue-600">To:</span> {calSel.to}</> : 'Pick end date'}</span>
                          <button type="button" onClick={() => setCalSel({ from: null, to: null })} className="text-rose-400 hover:text-rose-600 font-semibold">Clear</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Discount */}
                  <div className="mt-10">
                    <div className="bg-white shadow-sm p-8 border border-slate-200 text-center min-h-[480px] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-center mb-2">
                          <CardHeading icon={FaBolt}>Special Discount</CardHeading>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Limited Time Offer</p>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <input
                            type="number" min="0" max="100"
                            value={discountPercent}
                            onChange={(e) => { setDiscountPercent(e.target.value); setDiscountSaved(false); }}
                            className="w-16 text-3xl font-extrabold text-rose-500 text-right bg-transparent border-b-2 border-dashed border-rose-200 focus:outline-none focus:border-rose-400"
                          />
                          <span className="text-3xl font-extrabold text-rose-500">% OFF</span>
                        </div>
                        <textarea
                          value={discountDescription}
                          onChange={(e) => { setDiscountDescription(e.target.value); setDiscountSaved(false); }}
                          rows={3}
                          className="w-full max-w-xs mx-auto text-xs text-slate-500 leading-relaxed mb-6 text-center bg-transparent border border-dashed border-slate-200 p-2 focus:outline-none focus:border-blue-300 resize-none"
                        />
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <p className="text-xs font-bold text-slate-700 tracking-wide">PROMO CODE</p>
                          <button type="button" onClick={generatePromoCode} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline">Generate</button>
                        </div>
                        <PromoCodeInput code={promoCode} setCode={(c) => { setPromoCode(c); setDiscountSaved(false); }} />
                        <p className="text-[11px] text-slate-400 mt-1.5 mb-6">Type directly into the boxes, or click Generate for a random code</p>
                        <div className="flex items-center justify-center gap-4 mb-6">
                          <div className="text-left">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Valid From</label>
                            <input readOnly type="date" value={discountFrom} className="text-xs border border-slate-300 px-2 py-1.5 text-slate-700 bg-slate-50 cursor-default focus:outline-none" />
                          </div>
                          <div className="text-left">
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Valid To</label>
                            <input readOnly type="date" value={discountTo} className="text-xs border border-slate-300 px-2 py-1.5 text-slate-700 bg-slate-50 cursor-default focus:outline-none" />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDiscountSaved(true)}
                        className={`w-full max-w-xs mx-auto px-6 py-3 text-white text-sm font-bold transition-colors ${
                          discountSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {discountSaved ? '✓ Discount Saved' : 'Save Discount'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </form>

            {/* Bottom Buttons */}
            <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
              <button type="button" onClick={handleClear} className="px-8 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Clear</button>
              <button type="submit" form="package-form" disabled={loading} className="px-8 py-2.5 rounded-xl bg-[#007bff] hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-md disabled:bg-slate-400">
                {loading ? 'Processing...' : isEditMode ? 'Update Package' : 'Publish Package'}
              </button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

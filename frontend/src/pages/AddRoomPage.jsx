import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaBuilding, FaPlus, FaCloudUploadAlt, FaMapMarkerAlt, 
  FaBold, FaItalic, FaUnderline, FaCode, FaListUl, FaListOl, 
  FaRegCommentDots, FaEraser,
  FaAddressCard, FaChevronDown 
} from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';
import roomhome from '../assets/roomhome.png'
import toproom from '../assets/toproom.png'
import addroom from '../assets/addroom.png'


const BASE_URL = 'http://localhost:5000';

export default function AddRoomPage() {
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(editId);
  const [roomTypeOpen, setRoomTypeOpen] = useState(false);
  
  // 1. Unified Form State Object structured exactly like your Mongoose Schema
  const [formData, setFormData] = useState({
    roomName: '',
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
    amenities: []
  });

  const [customAmenities, setCustomAmenities] = useState([]);
  const [addingAmenity, setAddingAmenity] = useState(false);
  const [newAmenityValue, setNewAmenityValue] = useState('');
  const newAmenityInputRef = useRef(null);

  const [slotImages, setSlotImages] = useState([null, null, null, null]);
  const [slotFiles, setSlotFiles] = useState([null, null, null, null]);
  // existing image URLs from DB (edit mode) — kept when user doesn't replace a slot
  const [existingImages, setExistingImages] = useState([null, null, null, null]);
  const slotInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Pre-fill form when editing
  useEffect(() => {
    if (!editId) return;
    fetch(`${BASE_URL}/api/rooms/${editId}`)
      .then((r) => r.json())
      .then(({ room }) => {
        if (!room) return;
        const pricing = room.locationAndPricing?.[0] || {};
        setFormData({
          roomName:        room.roomName || '',
          roomType:        room.roomType || '',
          roomSize:        room.roomSize ?? '',
          measureType:     room.measureType || '',
          capacityAdults:  room.capacity?.adults ?? '',
          capacityChildren:room.capacity?.children ?? '',
          description:     room.description || '',
          contactName:     room.contactInfo?.contactName || '',
          contactNumber:   room.contactInfo?.contactNumber || '',
          email:           room.contactInfo?.email || '',
          aboutLocation:   pricing.aboutLocation || '',
          basePrice:       pricing.basePrice ?? '',
          paymentMethods:  Array.isArray(pricing.paymentMethods) ? pricing.paymentMethods : (pricing.paymentMethods ? [pricing.paymentMethods] : []),
          amenities:       room.amenities || [],
        });
        // Load existing images into slots for preview
        const imgs = (room.images || []).slice(0, 4);
        const filled = [null, null, null, null].map((_, i) =>
          imgs[i] ? (imgs[i].startsWith('http') ? imgs[i] : `${BASE_URL}${imgs[i]}`) : null
        );
        setSlotImages(filled);
        setExistingImages(filled);
        // Detect custom amenities not in the default list
        const defaultLabels = [
          'Terrace','Garden View','Free WiFi','Air Conditions',
          'Breakfast Included','Swimming Pool','Room Service','Free Parking','Tea Coffee Maker'
        ];
        setCustomAmenities((room.amenities || []).filter(a => !defaultLabels.includes(a)));
      })
      .catch(() => {});
  }, [editId]);

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

  // API Submission Lifecycle Status States
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Map backend Mongoose validation detail strings to form field keys
  const FIELD_MAP = [
    { keys: ['roomName'], field: 'roomName' },
    { keys: ['roomType'], field: 'roomType' },
    { keys: ['roomSize'], field: 'roomSize' },
    { keys: ['measureType'], field: 'measureType' },
    { keys: ['capacity.adults', 'adults'], field: 'capacityAdults' },
    { keys: ['capacity.children', 'children'], field: 'capacityChildren' },
    { keys: ['description'], field: 'description' },
    { keys: ['contactinfo.contactname', 'contactname'], field: 'contactName' },
    { keys: ['contactinfo.contactnumber', 'contactnumber'], field: 'contactNumber' },
    { keys: ['contactinfo.email', 'email'], field: 'email' },
    { keys: ['locationandpricing.0.baseprice', 'baseprice'], field: 'basePrice' },
    { keys: ['locationandpricing.0.paymentmethods', 'paymentmethods'], field: 'paymentMethods' },
  ];

  const parseBackendErrors = (details) => {
    const errors = {};
    details.forEach((msg) => {
      // Format is "path: message" — extract the path prefix
      const path = msg.split(':')[0].trim().toLowerCase();
      const match = FIELD_MAP.find(({ keys }) => keys.some((k) => k.toLowerCase() === path || path.includes(k.toLowerCase())));
      if (match) errors[match.field] = msg.split(':').slice(1).join(':').trim();
    });
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.roomName.trim())        errors.roomName = 'Room name is required.';
    if (!formData.roomType)               errors.roomType = 'Please select a room type.';
    if (formData.roomSize === '' || formData.roomSize === null) errors.roomSize = 'Room size is required.';
    if (!formData.measureType)            errors.measureType = 'Measure type is required.';
    if (formData.capacityAdults === '')   errors.capacityAdults = 'Adults capacity is required.';
    if (formData.capacityChildren === '') errors.capacityChildren = 'Children capacity is required.';
    if (!formData.description.trim())     errors.description = 'Description is required.';
    if (!formData.contactName.trim())     errors.contactName = 'Contact name is required.';
    if (!formData.contactNumber.trim())   errors.contactNumber = 'Contact number is required.';
    if (!formData.email.trim())           errors.email = 'Email is required.';
    if (formData.basePrice === '' || formData.basePrice === null) errors.basePrice = 'Base price is required.';
    if (!formData.paymentMethods.length)  errors.paymentMethods = 'Please select a payment method.';
    return errors;
  };

  const amenitiesList = [
    { id: 'terrace', label: 'Terrace' },
    { id: 'gardenView', label: 'Garden View' },
    { id: 'wifi', label: 'Free WiFi' },
    { id: 'ac', label: 'Air Conditions' },
    { id: 'breakfast', label: 'Breakfast Included' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'roomService', label: 'Room Service' },
    { id: 'parking', label: 'Free Parking' },
    { id: 'coffee', label: 'Tea Coffee Maker' },
  ];

  // 2. State Input Change Mutator Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAmenityToggle = (label) => {
    setFormData((prev) => {
      const current = [...prev.amenities];
      const index = current.indexOf(label);
      if (index > -1) {
        current.splice(index, 1); // Remove if checked off
      } else {
        current.push(label); // Add if selected
      }
      return { ...prev, amenities: current };
    });
  };

  const handleClear = () => {
    setFormData({
      roomName: '',
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
      amenities: []
    });
    setCustomAmenities([]);
    setSlotImages([null, null, null, null]);
    setSlotFiles([null, null, null, null]);
    setExistingImages([null, null, null, null]);
    setSuccessMessage('');
    setErrorMessage('');
    setFieldErrors({});
  };

  // 3. Submit Handler connecting to the Backend Route
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      const fd = new FormData();

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const hotelId = userData.hotels?.[0]?._id;
      if (hotelId) fd.append('hotelId', hotelId);

      fd.append('roomName', formData.roomName);
      fd.append('roomType', formData.roomType);
      fd.append('roomSize', Number(formData.roomSize));
      fd.append('measureType', formData.measureType);
      fd.append('description', formData.description);
      fd.append('capacity', JSON.stringify({
        adults: Number(formData.capacityAdults),
        children: Number(formData.capacityChildren),
      }));
      fd.append('amenities', JSON.stringify(formData.amenities));
      fd.append('contactInfo', JSON.stringify({
        contactName: formData.contactName,
        contactNumber: formData.contactNumber,
        email: formData.email,
      }));
      fd.append('locationAndPricing', JSON.stringify([{
        aboutLocation: formData.aboutLocation,
        basePrice: Number(formData.basePrice),
        paymentMethods: formData.paymentMethods,
      }]));

      if (isEditMode) {
        // In edit mode: send new files for replaced slots, keep existing URL for untouched slots
        const keptImages = slotFiles.map((file, i) => (file ? null : existingImages[i]));
        fd.append('keptImages', JSON.stringify(keptImages.filter(Boolean)));
        slotFiles.forEach((file) => { if (file) fd.append('images', file); });
      } else {
        slotFiles.forEach((file) => { if (file) fd.append('images', file); });
      }

      const url = isEditMode ? `${BASE_URL}/api/rooms/${editId}` : `${BASE_URL}/api/rooms`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, { method, body: fd });
      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          setFieldErrors(parseBackendErrors(data.details));
        }
        throw new Error(data.message || 'Validation error encountered updating database rows.');
      }

      if (isEditMode) {
        setSuccessMessage('✅ Room updated successfully!');
        setTimeout(() => navigate('/view-rooms-packages'), 1500);
      } else {
        setSuccessMessage(`🎉 Room added successfully! Room number is ${data.room.roomNumber}.`);
        setFormData((prev) => ({ ...prev, roomName: '' }));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed connecting to database API cluster nodes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-white to-[#A0DBFF] min-h-screen pt-28">
      <Header />
      
      {/* 1. HERO BANNER SECTION */}
        <section 
          className="relative h-screen w-full flex flex-col items-center justify-center px-4 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url(${roomhome})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
<div className="flex max-w-3xl flex-col items-start gap-9 w-full ml-[300px] mb-[250px]">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Add Rooms of Accomodations
            </h1>

            <p className="text-base md:text-2xl text-slate-800 font-medium">
              Fill in the Details to Create a New Room for <span className="font-bold">Your</span> Hotel!
            </p>

            <div className="relative w-full max-w-md shadow-md rounded-full">
              <input 
                type="text" 
                placeholder="Explore Room" 
                className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
              />
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
            </div>
          </div>
        </section>


      {/* 2. MAIN INPUT DASHBOARD CONTAINER */}
      <div className="max-w-[1450px] mx-auto px-4 md:px-8 pt-10 pb-16">
        <h2 className="text-2xl font-black text-slate-900 mb-6">{isEditMode ? 'Edit Room' : 'Add Room'}</h2>
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-10 text-sm">
      <main className="">
          
          {/* Header Indicator */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <img src={toproom} alt="Room" className="h-16 w-16 object-contain" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Room Details</h2>
          </div>

          {/* Feedback banners notification nodes */}
          {successMessage && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold">{successMessage}</div>}
          {errorMessage && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">{errorMessage}</div>}

          {/* Form Split Layout */}
          <form id="room-form" className="grid grid-cols-1 lg:grid-cols-2 gap-x-48 gap-y-8" onSubmit={handleSubmit}>
            
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Room Name *</label>
                <input 
                  type="text" 
                  name="roomName"
                  required
                  value={formData.roomName}
                  onChange={handleChange}
                  placeholder="e.g., Ocean View Suite 302"
                  className={`w-full px-4 py-2.5 border text-sm text-slate-800 focus:ring-1 focus:outline-none ${fieldErrors.roomName ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-400'}`}
                />
                {fieldErrors.roomName && <p className="mt-1 text-xs text-red-500">{fieldErrors.roomName}</p>}
              </div>

              {/* Room Type Custom Dropdown Selector */}
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">Room Type</label>
                <button
                  type="button"
                  onClick={() => { setRoomTypeOpen(!roomTypeOpen); setFieldErrors((prev) => ({ ...prev, roomType: undefined })); }}
                  className={`w-full text-left flex justify-between items-center px-4 py-2.5 border text-sm text-slate-600 bg-white ${fieldErrors.roomType ? 'border-red-500' : 'border-slate-300'}`}
                >
                  <span className={formData.roomType ? 'text-slate-600' : 'text-slate-400'}>{formData.roomType || 'Select a room type'}</span>
                  <span className="text-xs">▼</span>
                </button>
                {fieldErrors.roomType && <p className="mt-1 text-xs text-red-500">{fieldErrors.roomType}</p>}
                {roomTypeOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg z-20 overflow-hidden">
                    {[
                        'Single Room',
                        'Double Room',
                        'Twin Room',
                        'Queen Room',
                        'King Room',
                        'Deluxe Double Room',
                        'Family Room / Quad Room'
                      ].map((type) => (
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

              {/* Room Size, Measure Type, and Capacity */}
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

              {/* Amenities List Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-slate-700">Select Amenities</label>
                  <button
                    type="button"
                    onClick={handleAddMoreClick}
                    className="flex items-center gap-1.5 bg-sky-800 hover:bg-sky-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                  >
                    <span className="text-white font-bold leading-none">+</span>
                    Add more
                  </button>
                </div>
                <div className="space-y-2">
                  {[...amenitiesList.map(a => a.label), ...customAmenities].map((label) => (
                    <label key={label} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(label)}
                        onChange={() => handleAmenityToggle(label)}
                        className="w-3.5 h-3.5 accent-[#007bff] border-slate-300 rounded"
                      />
                      {label}
                    </label>
                  ))}
                  {addingAmenity && (
                    <label className="flex items-center gap-2">
                      <input type="checkbox" disabled className="w-3.5 h-3.5 border-slate-300 rounded" />
                      <input
                        ref={newAmenityInputRef}
                        type="text"
                        value={newAmenityValue}
                        onChange={(e) => setNewAmenityValue(e.target.value)}
                        onKeyDown={handleNewAmenityKeyDown}
                        placeholder="Type amenity and press Enter"
                        className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </label>
                  )}
                </div>

              </div>

              {/* Description Box */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <div className={`border overflow-hidden ${fieldErrors.description ? 'border-red-500' : 'border-slate-300'}`}>
                  <div className="flex items-center gap-4 px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                    <FaBold className="cursor-pointer" /> <FaItalic className="cursor-pointer" /> <FaUnderline className="cursor-pointer" />
                  </div>
                  <textarea 
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 text-xs text-slate-600 leading-relaxed focus:outline-none resize-none"
                  />
                </div>
                {fieldErrors.description && <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>}
              </div>

              {/* Contact Information Sub-block */}
              <div className="rounded-[2px] bg-[#eaeaea] px-7 py-8 border border-transparent shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] space-y-8 min-h-[520px]">
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
                      <input
                        type="text"
                        name="contactName"
                        required
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="Enter contact name"
                        className="w-full bg-transparent text-sm text-slate-500 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                    {fieldErrors.contactName && <p className="text-xs text-red-500">{fieldErrors.contactName}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] font-medium text-slate-900">Contact Number</label>
                    <div className={`bg-white px-4 py-3 flex items-center gap-3 ${fieldErrors.contactNumber ? 'border border-red-500' : 'border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'}`}>
                      <span className="flex items-center gap-1 text-sm text-slate-500 shrink-0">
                        <span className="text-base">🇱🇰</span>
                        <span>+94</span>
                      </span>
                      <input
                        type="text"
                        name="contactNumber"
                        required
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="Enter contact number"
                        className="w-full bg-transparent text-sm text-slate-500 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                    {fieldErrors.contactNumber && <p className="text-xs text-red-500">{fieldErrors.contactNumber}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] font-medium text-slate-900">Contact E mail:</label>
                    <div className={`bg-white px-4 py-3 ${fieldErrors.email ? 'border border-red-500' : 'border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'}`}>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter contact email"
                        className="w-full bg-transparent text-sm text-slate-500 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                    {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                  </div>
                </div>
              </div>

            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Uploaded Room Images</label>
                  <div className="w-full max-w-[320px] h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
                    <img src={slotImages.find(Boolean) || addroom} alt="Uploaded room preview" className="w-full h-full object-cover" />
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
                            <img src={slotImages[slot]} alt={`Room ${slot + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSlotImages((prev) => { const next = [...prev]; next[slot] = null; return next; }); setSlotFiles((prev) => { const next = [...prev]; next[slot] = null; return next; }); setExistingImages((prev) => { const next = [...prev]; next[slot] = null; return next; }); }}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white  w-4 h-4 flex items-center justify-center text-[10px] leading-none"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <FaPlus className="text-sm" />
                        )}
                        <input
                          ref={slotInputRefs[slot]}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSlotFile(slot, e.target.files[0])}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-sky-50/70 border border-sky-100 rounded-2xl px-6 py-7 text-center shadow-sm max-w-[500px]">
                  <FaCloudUploadAlt className="text-4xl text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800 mb-2">Drag &amp; Drop or Browse to upload the images</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Upload high quality images (.JPG, .PNG, .JPEG )<br />
                    Max Image size 5MB<br />
                    Recommended image size 1400px * 900px
                  </p>
                </div>
              </div>

              {/* Location & Pricing Content Wrapper Box */}
              <div className="rounded-[2px] bg-white border border-black px-7 py-8 space-y-8 min-h-[520px]">
                <div className="flex items-center justify-center gap-3 text-base font-bold text-slate-900">
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                    <FaMapMarkerAlt className="text-xs" />
                    <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-blue-600 border border-blue-200">
                      $
                    </span>
                  </span>
                  <span>Location &amp; Pricing</span>
                </div>

                <div className="space-y-3">
                  <label className="block text-[13px] font-medium text-slate-900">About the Location</label>
                  <textarea
                    rows={4}
                    name="aboutLocation"
                    value={formData.aboutLocation}
                    onChange={handleChange}
                    placeholder="Describe the property location"
                    className="w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 leading-relaxed focus:outline-none resize-none min-h-[124px]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[13px] font-medium text-slate-900">Base Price(per night)</label>
                  <div className={`flex overflow-hidden border bg-white ${fieldErrors.basePrice ? 'border-red-500' : 'border-slate-300'}`}>
                    <div className="flex-1 px-4 py-3">
                      <input
                        type="number"
                        name="basePrice"
                        required
                        value={formData.basePrice}
                        onChange={handleChange}
                        placeholder="$150"
                        className="w-full bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-300 px-4 text-sm text-slate-500">
                      <span>USD</span>
                      <FaChevronDown className="text-xs" />
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
                          onChange={() => {
                            setFormData((prev) => {
                              const current = prev.paymentMethods.includes(option)
                                ? prev.paymentMethods.filter((m) => m !== option)
                                : [...prev.paymentMethods, option];
                              return { ...prev, paymentMethods: current };
                            });
                            setFieldErrors((prev) => ({ ...prev, paymentMethods: undefined }));
                          }}
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
          </form>

          {/* Bottom action buttons */}
          <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleClear}
              className="px-8 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              form="room-form"
              disabled={loading}
              className="px-8 py-2.5 rounded-xl bg-[#007bff] hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-md disabled:bg-slate-400"
            >
              {loading ? 'Processing...' : isEditMode ? 'Update Room' : 'Publish Room'}
            </button>
          </div>

      </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
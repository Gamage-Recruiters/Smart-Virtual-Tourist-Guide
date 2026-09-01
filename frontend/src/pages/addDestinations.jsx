import React, { useState } from 'react';
import axios from 'axios';

const AddDestination = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    location: '',
    longDescription: '',
    shortDescription: '',
    images: '',
    heroImage: '',
    thumbnailImage: '',
    price: '',
    priceDisplay: '',
    currency: 'LKR',
    duration: '',
    durationDisplay: '',
    rating: '',
    reviewCount: '',
    travelersCount: '',
    travelersDisplay: '',
    maxGroupSize: '',
    minGroupSize: '1',
    categories: [],
    province: '',
    district: '',
    adventureLevel: '',
    isFamilyFriendly: false,
    isSoloTravel: false,
    isCoupleFriendly: false,
    isGroupFriendly: false,
    bestSeason: [],
    bestSeasonDisplay: '',
    features: '',
    amenities: '',
    isActive: true,
    isPopular: false,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    coordinatesLat: '',
    coordinatesLng: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    contactWebsite: '',
    cancellationPolicy: '',
    includes: '',
    excludes: '',
    whatToBring: '',
    importantInfo: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const toggleCategory = (category) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
  };

  const toggleBestSeason = (month) => {
    if (formData.bestSeason.includes(month)) {
      setFormData({
        ...formData,
        bestSeason: formData.bestSeason.filter((m) => m !== month),
      });
    } else {
      setFormData({
        ...formData,
        bestSeason: [...formData.bestSeason, month],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data payload matching backend schema
    const payload = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : undefined,
      travelersCount: formData.travelersCount ? parseInt(formData.travelersCount) : undefined,
      maxGroupSize: formData.maxGroupSize ? parseInt(formData.maxGroupSize) : undefined,
      minGroupSize: formData.minGroupSize ? parseInt(formData.minGroupSize) : 1,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      coordinates: {
        lat: parseFloat(formData.coordinatesLat) || undefined,
        lng: parseFloat(formData.coordinatesLng) || undefined
      },
      contactInfo: {
        phone: formData.contactPhone,
        email: formData.contactEmail,
        website: formData.contactWebsite
      },
      bookingInfo: {
        cancellationPolicy: formData.cancellationPolicy,
        includes: formData.includes.split(',').map(i => i.trim()).filter(Boolean),
        excludes: formData.excludes.split(',').map(e => e.trim()).filter(Boolean),
        whatToBring: formData.whatToBring.split(',').map(w => w.trim()).filter(Boolean),
        importantInfo: formData.importantInfo
      }
    };

    try {
      const response = await axios.post('http://localhost:5000/api/destinations', payload);
      console.log('Destination saved:', response.data);
      alert('Destination added successfully!');
      // Simple reset for this example
      window.location.reload(); 
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Failed to add destination.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Add New Destination
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">1. Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-lg p-3" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Subtitle</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border rounded-lg p-3" required />
              </div>
            </div>
          </div>

          {/* SECTION 2: DESCRIPTIONS */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">2. Descriptions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Short Description</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border rounded-lg p-3" rows="2" maxLength="200" placeholder="Brief summary (max 200 chars)"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Long Description *</label>
                <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full border rounded-lg p-3" rows="5" required></textarea>
              </div>
            </div>
          </div>

          {/* SECTION 3: MEDIA */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">3. Media Files (URLs)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Hero Image *</label>
                <input type="text" name="heroImage" value={formData.heroImage} onChange={handleChange} className="w-full border rounded-lg p-3" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Thumbnail Image</label>
                <input type="text" name="thumbnailImage" value={formData.thumbnailImage} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Gallery Images * (Comma-separated URLs)</label>
                <input type="text" name="images" value={formData.images} onChange={handleChange} className="w-full border rounded-lg p-3" required placeholder="url1.jpg, url2.jpg" />
              </div>
            </div>
          </div>

          {/* SECTION 4: PRICING & LOGISTICS */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">4. Pricing & Logistics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price (Base) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded-lg p-3" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price Display (e.g. Rs 18,500 / PP)</label>
                <input type="text" name="priceDisplay" value={formData.priceDisplay} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Duration (Days)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Duration Display (e.g. 2 Days)</label>
                <input type="text" name="durationDisplay" value={formData.durationDisplay} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Rating (0-5)</label>
                <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Review Count</label>
                <input type="number" name="reviewCount" value={formData.reviewCount} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Travelers Count</label>
                <input type="number" name="travelersCount" value={formData.travelersCount} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Travelers Display (e.g. 10+ Travelers)</label>
                <input type="text" name="travelersDisplay" value={formData.travelersDisplay} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Max Group Size</label>
                <input type="number" name="maxGroupSize" value={formData.maxGroupSize} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Min Group Size</label>
                <input type="number" name="minGroupSize" value={formData.minGroupSize} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
            </div>
          </div>

          {/* SECTION 5: CLASSIFICATION (Categories, Location, Season) */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">5. Classification & Filters</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Province</label>
                <select name="province" value={formData.province} onChange={handleChange} className="w-full border rounded-lg p-3">
                  <option value="">Select Province</option>
                  {['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">District</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Adventure Level</label>
                <select name="adventureLevel" value={formData.adventureLevel} onChange={handleChange} className="w-full border rounded-lg p-3">
                  <option value="">Select Level</option>
                  {['Low', 'Moderate', 'High', 'Extreme'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Categories (Click to select/deselect)</label>
                <div className="flex flex-wrap gap-2">
                  {['Beaches', 'Mountains', 'National Parks', 'Historical', 'Waterfalls', 'Cities', 'Cultural', 'Wildlife', 'Religious', 'Adventure'].map(c => {
                    const isSelected = formData.categories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCategory(c)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          isSelected 
                            ? 'bg-[#5BA3F5] text-white border-[#5BA3F5]' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {c} {isSelected && <span className="ml-1 opacity-70">✕</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Best Season (Click to select months)</label>
                <div className="flex flex-wrap gap-2">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => {
                    const isSelected = formData.bestSeason.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleBestSeason(m)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          isSelected 
                            ? 'bg-[#5BA3F5] text-white border-[#5BA3F5]' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {m} {isSelected && <span className="ml-1 opacity-70">✕</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isFamilyFriendly" checked={formData.isFamilyFriendly} onChange={handleChange} className="w-5 h-5 text-red-500" />
                <span>Family Friendly</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isSoloTravel" checked={formData.isSoloTravel} onChange={handleChange} className="w-5 h-5 text-red-500" />
                <span>Solo Travel</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isCoupleFriendly" checked={formData.isCoupleFriendly} onChange={handleChange} className="w-5 h-5 text-red-500" />
                <span>Couple Friendly</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isGroupFriendly" checked={formData.isGroupFriendly} onChange={handleChange} className="w-5 h-5 text-red-500" />
                <span>Group Friendly</span>
              </label>
            </div>
          </div>

          {/* SECTION 6: AMENITIES & FEATURES */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">6. Features & Amenities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Features (Comma-separated)</label>
                <input type="text" name="features" value={formData.features} onChange={handleChange} className="w-full border rounded-lg p-3" placeholder="UNESCO Site, Beach Access" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Amenities (Comma-separated)</label>
                <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full border rounded-lg p-3" placeholder="WiFi, Parking, Restaurant" />
              </div>
            </div>
          </div>

          {/* SECTION 7: BOOKING INFO */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">7. Booking Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Includes (Comma-separated)</label>
                <input type="text" name="includes" value={formData.includes} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Excludes (Comma-separated)</label>
                <input type="text" name="excludes" value={formData.excludes} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Cancellation Policy</label>
                <input type="text" name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} className="w-full border rounded-lg p-3" />
              </div>
            </div>
          </div>

          {/* SECTION 8: STATUS */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#5BA3F5]">8. Status</h2>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-red-500" />
                <span>Is Active (Available)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="w-5 h-5 text-red-500" />
                <span>Mark as Popular</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 text-red-500" />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105"
            >
              Save Destination
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDestination;
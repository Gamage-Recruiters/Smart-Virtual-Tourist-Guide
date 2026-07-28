import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const AMENITY_OPTIONS = ['Free WiFi', 'Parking', 'Outdoor Seating', 'Live Music']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function ResturentProfilePage() {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [form, setForm] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const restRes = await fetch(`${API_BASE}/restaurants`, { headers })
        const all = await restRes.json()
        const matched = Array.isArray(all) ? all.find(r => r.email === user.email) : null

        if (matched) {
          setRestaurant(matched)
          setImagePreview(matched.bannerImage || '')
          setForm({
            restaurantName: matched.restaurantName || '',
            ownerName: matched.ownerName || '',
            email: matched.email || '',
            phone: matched.phone || '',
            address: matched.address || '',
            district: matched.district || '',
            description: matched.description || '',
            amenities: matched.amenities || [],
            bannerImage: matched.bannerImage || '',
            socialLinks: {
              website: matched.socialLinks?.website || '',
              facebook: matched.socialLinks?.facebook || '',
              instagram: matched.socialLinks?.instagram || '',
              tiktok: matched.socialLinks?.tiktok || '',
            },
            operatingHours: DAYS.map(day => {
              const existing = matched.operatingHours?.find(h => h.day === day)
              return { day, open: existing?.open || '09:00', close: existing?.close || '22:00', enabled: !!existing }
            }),
            tables: {
              ethereal: {
                name: matched.tables?.ethereal?.name || "The ethereal (full luxury experience)",
                pricePerPerson: matched.tables?.ethereal?.pricePerPerson || 285,
                limit: matched.tables?.ethereal?.limit || 500
              },
              obsidian: {
                name: matched.tables?.obsidian?.name || "Obsidian terrace (open air sunset dinning)",
                pricePerPerson: matched.tables?.obsidian?.pricePerPerson || 195,
                limit: matched.tables?.obsidian?.limit || 500
              }
            }
          })
        }
      } catch (err) {
        console.error('Profile fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleTableChange = (tableKey, field, value) => {
    setForm(prev => ({
      ...prev,
      tables: {
        ...prev.tables,
        [tableKey]: {
          ...prev.tables[tableKey],
          [field]: value
        }
      }
    }))
  }

  const handleSocialChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }))
  }

  const handleAmenityChange = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleHoursChange = (index, field, value) => {
    setForm(prev => {
      const hours = [...prev.operatingHours]
      hours[index] = { ...hours[index], [field]: value }
      return { ...prev, operatingHours: hours }
    })
  }

  const handleFileSelected = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      const token = localStorage.getItem('token')
      let bannerImageUrl = form.bannerImage

      if (selectedFile) {
        setUploading(true)
        const uploadData = new FormData()
        uploadData.append('image', selectedFile)

        const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadData
        })
        const uploadResult = await uploadRes.json()
        if (uploadRes.ok && uploadResult.success) {
          bannerImageUrl = uploadResult.imageUrl
        }
        setUploading(false)
      }

      const activeHours = form.operatingHours.filter(h => h.enabled).map(({ day, open, close }) => ({ day, open, close }))

      const res = await fetch(`${API_BASE}/restaurants/${restaurant._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          restaurantName: form.restaurantName,
          ownerName: form.ownerName,
          phone: form.phone,
          address: form.address,
          district: form.district,
          amenities: form.amenities,
          socialLinks: form.socialLinks,
          operatingHours: activeHours,
          bannerImage: bannerImageUrl,
          tables: {
            ethereal: {
              name: form.tables.ethereal.name,
              pricePerPerson: Number(form.tables.ethereal.pricePerPerson),
              limit: Number(form.tables.ethereal.limit)
            },
            obsidian: {
              name: form.tables.obsidian.name,
              pricePerPerson: Number(form.tables.obsidian.pricePerPerson),
              limit: Number(form.tables.obsidian.limit)
            }
          }
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setRestaurant(updated)
        setForm(prev => ({ ...prev, bannerImage: updated.bannerImage }))
        setSaveMsg('Profile saved successfully!')
      } else {
        setSaveMsg('Failed to save. Please try again.')
      }
    } catch (err) {
      setSaveMsg('Network error. Please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  if (loading) return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="py-16 text-center text-sm text-slate-500">Loading profile...</div>
    </section>
  )

  if (!form) return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="py-16 text-center text-sm text-slate-500">No restaurant profile found. Please register your restaurant first.</div>
    </section>
  )

  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">Profile</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Restaurant Profile</h2>
        <p className="mt-1 text-sm text-blue-100">Update your restaurant information visible to tourists.</p>
      </header>

      <form onSubmit={handleSave} className="p-6 space-y-8">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Basic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-700">Restaurant Name</label>
              <input name="restaurantName" value={form.restaurantName} onChange={handleChange} type="text" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white" />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-700">Owner Name</label>
              <input name="ownerName" value={form.ownerName} onChange={handleChange} type="text" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white" />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-700">Email</label>
              <input name="email" value={form.email} type="email" disabled className="w-full rounded-lg border border-slate-100 bg-slate-100 px-3 py-2 text-sm text-slate-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-700">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs font-medium text-slate-700">Address</label>
              <input name="address" value={form.address} onChange={handleChange} type="text" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs font-medium text-slate-700">District *</label>
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white"
              >
                <option value="">-- Choose District --</option>
                {[
                  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
                  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
                  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", 
                  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
                  "Monaragala", "Ratnapura", "Kegalle"
                ].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs font-medium text-slate-700">Restaurant Banner Image / Profile Pic</label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelected}
                  className="hidden"
                  id="profile-pic-upload"
                />
                <label
                  htmlFor="profile-pic-upload"
                  className="cursor-pointer rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Choose New Photo
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-28 object-cover rounded-lg border border-slate-200"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Amenities</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {AMENITY_OPTIONS.map(amenity => (
              <label key={amenity} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="h-4 w-4 rounded border-blue-400 text-blue-600 focus:ring-blue-500" />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Social Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {['website', 'facebook', 'instagram', 'tiktok'].map(platform => (
              <div key={platform}>
                <label className="block mb-1 text-xs font-medium text-slate-700 capitalize">{platform}</label>
                <input name={platform} value={form.socialLinks[platform]} onChange={handleSocialChange} type="url" placeholder={`https://${platform}.com/...`} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Operating Hours</h3>
          <div className="space-y-3">
            {form.operatingHours.map((item, index) => (
              <div key={item.day} className="flex items-center gap-4">
                <label className="flex items-center gap-2 w-32 text-sm text-slate-700">
                  <input type="checkbox" checked={item.enabled} onChange={e => handleHoursChange(index, 'enabled', e.target.checked)} className="h-4 w-4 rounded border-blue-400 text-blue-600" />
                  {item.day.slice(0, 3)}
                </label>
                <input type="time" value={item.open} onChange={e => handleHoursChange(index, 'open', e.target.value)} disabled={!item.enabled} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-blue-400 disabled:opacity-40" />
                <span className="text-slate-400 text-sm">–</span>
                <input type="time" value={item.close} onChange={e => handleHoursChange(index, 'close', e.target.value)} disabled={!item.enabled} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-blue-400 disabled:opacity-40" />
              </div>
            ))}
          </div>
        </div>

        {/* Table Booking Configurations */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Table Booking Configurations</h3>
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Ethereal Table Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">Luxury Experience</h4>
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-slate-700">Experience Name</label>
                <input
                  type="text"
                  value={form.tables?.ethereal?.name || ''}
                  onChange={e => handleTableChange('ethereal', 'name', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[11px] font-semibold text-slate-700">Price ($ per person)</label>
                  <input
                    type="number"
                    value={form.tables?.ethereal?.pricePerPerson || ''}
                    onChange={e => handleTableChange('ethereal', 'pricePerPerson', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[11px] font-semibold text-slate-700">Capacity (Tables)</label>
                  <input
                    type="number"
                    value={form.tables?.ethereal?.limit || ''}
                    onChange={e => handleTableChange('ethereal', 'limit', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Obsidian Table Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600">Sunset Dining</h4>
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-slate-700">Experience Name</label>
                <input
                  type="text"
                  value={form.tables?.obsidian?.name || ''}
                  onChange={e => handleTableChange('obsidian', 'name', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[11px] font-semibold text-slate-700">Price ($ per person)</label>
                  <input
                    type="number"
                    value={form.tables?.obsidian?.pricePerPerson || ''}
                    onChange={e => handleTableChange('obsidian', 'pricePerPerson', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[11px] font-semibold text-slate-700">Capacity (Tables)</label>
                  <input
                    type="number"
                    value={form.tables?.obsidian?.limit || ''}
                    onChange={e => handleTableChange('obsidian', 'limit', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* Save */}
        <div className="flex items-center justify-end gap-4 pt-2 border-t border-slate-100">
          {saveMsg && (
            <span className={`text-sm font-medium ${saveMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMsg}
            </span>
          )}
          <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ResturentProfilePage

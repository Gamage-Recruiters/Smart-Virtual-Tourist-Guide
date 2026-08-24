import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import bgImage from '../../assets/Resturent_Menu.png'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const categoryOptions = ['Authentic Sri Lanka', 'Appetizer', 'Main Course', 'Dessert', 'Beverage']
const foodTypeOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan']

function ResturentAddMenuPage() {
  const navigate = useNavigate()
  const { id } = useParams() // Get menu item ID if in Edit Mode
  const isEditMode = !!id

  const [selectedCategory, setSelectedCategory] = useState('Authentic Sri Lanka')
  const [foodType, setFoodType] = useState('Non-Vegetarian')
  const [isAvailableToday, setIsAvailableToday] = useState(true)
  const [formData, setFormData] = useState({ name: '', description: '', price: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const categoryPreview = useMemo(() => selectedCategory, [selectedCategory])

  // Fetch menu item data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchMenuItem = async () => {
        try {
          const token = localStorage.getItem('restaurantToken')
          const res = await fetch(`${API_BASE}/menu/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setFormData({
              name: data.name || '',
              description: data.description || '',
              price: data.price || ''
            })
            setSelectedCategory(data.category || 'Authentic Sri Lanka')
            setFoodType(data.foodType || 'Non-Vegetarian')
            setIsAvailableToday(data.isAvailable !== false)
            if (data.imageUrl) {
              setImagePreview(data.imageUrl)
            }
          }
        } catch (err) {
          console.error('Error fetching menu item details:', err)
        }
      }
      fetchMenuItem()
    }
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleFileSelected = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Dish name is required'
    if (!formData.price) newErrors.price = 'Price is required'
    else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) newErrors.price = 'Enter a valid price'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    setApiError('')
    try {
      const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
      const token = localStorage.getItem('restaurantToken')

      // Find this owner's restaurant
      const restRes = await fetch(`${API_BASE}/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const allRestaurants = await restRes.json()
      const matched = Array.isArray(allRestaurants)
        ? allRestaurants.find(r => r.email === user.email)
        : null

      if (!matched) {
        setApiError('Restaurant profile not found. Please complete registration first.')
        setLoading(false)
        return
      }

      // Step 1: Upload photo if selected
      let uploadedImageUrl = imagePreview // Keep existing if no new file chosen
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
          uploadedImageUrl = uploadResult.imageUrl
        }
        setUploading(false)
      }

      const url = isEditMode ? `${API_BASE}/menu/${id}` : `${API_BASE}/menu`
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          restaurantId: matched._id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          category: selectedCategory,
          foodType,
          isAvailable: isAvailableToday,
          imageUrl: uploadedImageUrl
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setApiError(data.message || 'Failed to save menu item.')
        return
      }

      navigate('/resturent/dashboard/menu')
    } catch (err) {
      setApiError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <section className="overflow-hidden rounded-3xl bg-slate-50 shadow-xl ring-1 ring-slate-200">
      <header className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={bgImage}
          alt="Beach restaurant background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/20 to-slate-900/25" />

        <div className="relative flex h-full min-h-[420px] flex-col justify-end p-5 md:min-h-[520px] md:p-8 lg:p-10">
          <div className="max-w-2xl rounded-2xl bg-slate-950/30 p-5 text-white backdrop-blur-[2px] md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Menu Builder
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              {isEditMode ? 'Edit Menu Item' : 'Upload New Menu Item'}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 md:text-base">
              {isEditMode
                ? 'Modify your dish details, pricing, availability status, or update photography.'
                : 'Add a new dish to your digital showcase for international travelers and locals.'
              }
            </p>
          </div>
        </div>
      </header>


      <main className="bg-blue-50 px-5 py-6 md:px-8 md:py-8">
        {/* API Error */}
        {apiError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Photo Upload Placeholder */}
          <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Dish Photography</h3>
            <div className="mt-4 rounded-2xl bg-blue-50 p-5 text-center ring-1 ring-blue-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelected}
                className="hidden"
                id="menu-photo-upload"
              />
              <label
                htmlFor="menu-photo-upload"
                className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white text-blue-500 cursor-pointer overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <div className="rounded-full bg-blue-50 p-3 text-2xl">📷</div>
                    <p className="mt-4 text-sm font-semibold text-slate-700">Click to upload</p>
                    <p className="mt-1 text-xs text-slate-400">High-res JPG or PNG</p>
                  </>
                )}
              </label>
              <div className="mt-4 rounded-xl bg-white p-3 text-left text-xs text-slate-500 ring-1 ring-slate-200">
                Bright, natural lighting works best for food shots to attract international travelers.
              </div>
            </div>
          </aside>


          {/* Form */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
            <div className="grid gap-5">

              {/* Dish Name */}
              <div>
                <label htmlFor="dishName" className="mb-2 block text-sm font-medium text-slate-900">
                  Dish Name *
                </label>
                <input
                  id="dishName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter dish name"
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none transition focus:bg-white ${errors.name ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-900">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description of the dish"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-900">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={[
                        'rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors',
                        categoryPreview === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      ].join(' ')}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Type */}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-900">Food Type</p>
                <div className="flex flex-wrap gap-2">
                  {foodTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFoodType(type)}
                      className={[
                        'rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors',
                        foodType === type
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      ].join(' ')}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-900">
                  Price (LKR) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full max-w-sm rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none transition focus:bg-white ${errors.price ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              </div>

              {/* Toggles */}
              <div className="grid gap-4">
                <label className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 cursor-pointer">
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Available Today?</span>
                    <span className="mt-1 block text-xs text-slate-500">Currently available to serve customers</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={isAvailableToday}
                    onChange={(e) => setIsAvailableToday(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/resturent/dashboard/menu')}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  )
}

export default ResturentAddMenuPage

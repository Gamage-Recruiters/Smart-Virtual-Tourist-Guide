import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function ResturentOfferPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [restaurantId, setRestaurantId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null) // ID of offer being edited
  const [formData, setFormData] = useState({
    title: '', description: '', discountPercentage: '', startDate: '', endDate: '', targetAudience: '', termsAndConditions: ''
  })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('restaurantUser') || '{}')
        const token = localStorage.getItem('restaurantToken')
        const headers = { Authorization: `Bearer ${token}` }

        const restRes = await fetch(`${API_BASE}/restaurants`, { headers })
        const allRestaurants = await restRes.json()
        const matched = Array.isArray(allRestaurants)
          ? allRestaurants.find(r => r.email === user.email)
          : null

        if (!matched) { setLoading(false); return }
        setRestaurantId(matched._id)

        const offersRes = await fetch(`${API_BASE}/offers/restaurant/${matched._id}`, { headers })
        const data = await offersRes.json()
        setOffers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Offers fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem('restaurantToken')
      const res = await fetch(`${API_BASE}/offers/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const updated = await res.json()
        setOffers(prev => prev.map(o => (o._id === id ? updated : o)))
      }
    } catch (err) {
      console.error('Toggle offer error:', err)
    }
  }

  const handleEdit = (offer) => {
    // Format dates to YYYY-MM-DD for HTML5 date input
    const formatInputDate = (d) => d ? new Date(d).toISOString().split('T')[0] : ''
    
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      discountPercentage: offer.discountPercentage || '',
      startDate: formatInputDate(offer.startDate),
      endDate: formatInputDate(offer.endDate),
      targetAudience: offer.targetAudience || '',
      termsAndConditions: offer.termsAndConditions || ''
    })
    setEditingId(offer._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this offer?')) return
    try {
      const token = localStorage.getItem('restaurantToken')
      const res = await fetch(`${API_BASE}/offers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setOffers(prev => prev.filter(o => o._id !== id))
    } catch (err) {
      console.error('Delete offer error:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.discountPercentage || !formData.startDate || !formData.endDate) {
      setFormError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const token = localStorage.getItem('restaurantToken')
      const url = editingId ? `${API_BASE}/offers/${editingId}` : `${API_BASE}/offers`
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, restaurantId, discountPercentage: Number(formData.discountPercentage) }),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.message || 'Failed to save offer.'); return }

      if (editingId) {
        setOffers(prev => prev.map(o => o._id === editingId ? data : o))
      } else {
        setOffers(prev => [data, ...prev])
      }
      
      setShowForm(false)
      setEditingId(null)
      setFormData({ title: '', description: '', discountPercentage: '', startDate: '', endDate: '', targetAudience: '', termsAndConditions: '' })
    } catch (err) {
      setFormError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '—'

  const handleToggleForm = () => {
    if (showForm) {
      setShowForm(false)
      setEditingId(null)
      setFormData({ title: '', description: '', discountPercentage: '', startDate: '', endDate: '', targetAudience: '', termsAndConditions: '' })
    } else {
      setShowForm(true)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Offers</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Manage Offers</h2>
          <p className="mt-1 text-sm text-slate-500">Create and manage promotions for your restaurant.</p>
        </div>
        <button
          onClick={handleToggleForm}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Offer'}
        </button>
      </header>


      {/* Create/Edit Offer Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 border-b border-blue-200/60 pb-2 mb-2">
              {editingId ? 'Edit Offer Details' : 'Create New Promotion'}
            </h3>
          </div>
          {formError && (
            <div className="sm:col-span-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">{formError}</div>
          )}
          <div className="sm:col-span-2">
            <label className="block mb-1 text-xs font-medium text-slate-700">Offer Title *</label>

            <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} type="text" placeholder="e.g. 20% Off on Weekends" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 text-xs font-medium text-slate-700">Description *</label>
            <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows="2" placeholder="Offer details..." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-700">Discount % *</label>
            <input value={formData.discountPercentage} onChange={e => setFormData(p => ({ ...p, discountPercentage: e.target.value }))} type="number" min="0" max="100" placeholder="0–100" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-700">Target Audience</label>
            <input value={formData.targetAudience} onChange={e => setFormData(p => ({ ...p, targetAudience: e.target.value }))} type="text" placeholder="e.g. Tourists, Families" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-700">Start Date *</label>
            <input value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} type="date" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-700">End Date *</label>
            <input value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} type="date" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 text-xs font-medium text-slate-700">Terms & Conditions</label>
            <input value={formData.termsAndConditions} onChange={e => setFormData(p => ({ ...p, termsAndConditions: e.target.value }))} type="text" placeholder="e.g. Valid for dine-in only" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Offer'}
            </button>
          </div>
        </form>
      )}

      {/* Offers List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading offers...</div>
      ) : offers.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-slate-500 text-sm">No offers yet. Create your first promotion!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {offers.map(offer => (
            <article key={offer._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{offer.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{offer.description}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {offer.discountPercentage}% OFF
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1 mb-4">
                <div><span className="font-medium">Period: </span>{formatDate(offer.startDate)} → {formatDate(offer.endDate)}</div>
                {offer.targetAudience && <div><span className="font-medium">Audience: </span>{offer.targetAudience}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(offer._id)} className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                  {offer.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleEdit(offer)} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(offer._id)} className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors">
                  Delete
                </button>
              </div>
            </article>

          ))}
        </div>
      )}
    </section>
  )
}

export default ResturentOfferPage

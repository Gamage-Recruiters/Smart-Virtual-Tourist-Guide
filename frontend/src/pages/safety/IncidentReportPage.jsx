import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCamera, FiMapPin, FiTrash2 } from 'react-icons/fi'
import { FaRegClipboard } from 'react-icons/fa'
import { MdOutlineReportProblem } from 'react-icons/md'
import MapContainer from '../../components/safety/MapContainer'
import safetyService from '../../services/safetyService'
import { useGeolocation } from '../../hooks/useGeolocation'
import backgroundImage from '../../assets/safety/back_dp.png'

const categories = ['Severe Weather (Flood/Wind)', 'Landslide', 'Road Blockage', 'Accident', 'Other Emergency']
const districtCenters = {
  Ampara: { lat: 7.3018, lng: 81.6747 },
  Anuradhapura: { lat: 8.3114, lng: 80.4037 },
  Badulla: { lat: 6.9934, lng: 81.055 },
  Batticaloa: { lat: 7.7102, lng: 81.6924 },
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Galle: { lat: 6.0535, lng: 80.221 },
  Gampaha: { lat: 7.0873, lng: 79.999 },
  Hambantota: { lat: 6.1241, lng: 81.1185 },
  Jaffna: { lat: 9.6615, lng: 80.0255 },
  Kalutara: { lat: 6.5854, lng: 79.9607 },
  Kandy: { lat: 7.2906, lng: 80.6337 },
  Kegalle: { lat: 7.2513, lng: 80.3464 },
  Kilinochchi: { lat: 9.3803, lng: 80.377 },
  Kurunegala: { lat: 7.4863, lng: 80.3647 },
  Mannar: { lat: 8.981, lng: 79.9044 },
  Matale: { lat: 7.4675, lng: 80.6234 },
  Matara: { lat: 5.9549, lng: 80.555 },
  Monaragala: { lat: 6.8728, lng: 81.3507 },
  Mullaitivu: { lat: 9.2671, lng: 80.8142 },
  'Nuwara Eliya': { lat: 6.9497, lng: 80.7891 },
  Polonnaruwa: { lat: 7.9403, lng: 81.0188 },
  Puttalam: { lat: 8.0362, lng: 79.8283 },
  Ratnapura: { lat: 6.7056, lng: 80.3847 },
  Trincomalee: { lat: 8.5874, lng: 81.2152 },
  Vavuniya: { lat: 8.7514, lng: 80.4971 },
}
const districts = Object.keys(districtCenters)

const initialForm = {
  reporterName: '',
  contactNumber: '',
  incidentCategory: 'Severe Weather (Flood/Wind)',
  incidentDate: '',
  incidentTime: '',
  district: 'Colombo',
  location: { lat: 6.9271, lng: 79.8612 },
  images: [],
}

export default function IncidentReportPage() {
  const navigate = useNavigate()
  const { location: userLocation } = useGeolocation()
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('')

  const selectedMarker = useMemo(() => {
    if (!formData.location) return []
    return [
      {
        id: 'incident-location',
        lat: formData.location.lat,
        lng: formData.location.lng,
        color: 'red',
        popup: 'Selected incident location',
      },
    ]
  }, [formData.location])

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    }
  }, [photoPreviewUrl])

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      delete next.submit
      return next
    })
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.reporterName.trim()) nextErrors.reporterName = 'Full name is required'
    if (!formData.contactNumber.trim()) nextErrors.contactNumber = 'Contact number is required'
    if (!formData.incidentCategory) nextErrors.incidentCategory = 'Select an incident category'
    if (!formData.incidentDate) nextErrors.incidentDate = 'Select the incident date'
    if (!formData.incidentTime) nextErrors.incidentTime = 'Select the incident time'
    if (!formData.district) nextErrors.district = 'Select a district'
    if (!formData.location) nextErrors.location = 'Set a location on the map'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const useCurrentLocation = () => {
    if (!userLocation.latitude) return
    setField('location', { lat: userLocation.latitude, lng: userLocation.longitude })
  }

  const selectDistrict = (district) => {
    setFormData((prev) => ({
      ...prev,
      district,
      location: districtCenters[district] || prev.location,
    }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.district
      delete next.location
      delete next.submit
      return next
    })
  }

  const selectIncidentPhotos = (files) => {
    const nextFiles = Array.from(files || [])
    setField('images', nextFiles)

    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    setPhotoPreviewUrl(nextFiles[0] ? URL.createObjectURL(nextFiles[0]) : '')
  }

  const removeIncidentPhotos = () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    setPhotoPreviewUrl('')
    setField('images', [])
  }

  const goToReportsPage = () => {
    navigate('/safety/my-incidents')
  }

  const submitReport = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('reporterName', formData.reporterName)
      payload.append('contactNumber', formData.contactNumber)
      payload.append('incidentCategory', formData.incidentCategory)
      payload.append('incidentDate', new Date(formData.incidentDate).toLocaleDateString('en-US'))
      payload.append('incidentTime', formData.incidentTime)
      payload.append('district', formData.district)
      payload.append('location[lat]', formData.location.lat)
      payload.append('location[lng]', formData.location.lng)
      // touristId is now set automatically by the backend from the authenticated user
      // TODO: Remove this temporary hardcoded ID once auth is ready
      payload.append('touristId', '6a28dc49a14342989f1e4ee4')
      
      // TODO: Replace with dynamic travel ID from context once Trip management is complete
      payload.append('travelId', 'TRIP-7a8b9c0d1e2f')

      formData.images.forEach((file) => {
        payload.append('images', file)
      })

      const response = await safetyService.createIncident(payload)
      const referenceNumber = response.referenceNumber || response.data?.referenceNumber || `SRL-2026-${Date.now().toString().slice(-4)}`

      const imagePreviews = formData.images.map((file) => URL.createObjectURL(file))

      navigate('/safety/report-success', {
        replace: true,
        state: {
          referenceNumber,
          location: formData.location,
          district: formData.district,
          images: imagePreviews,
        },
      })
    } catch (error) {
      setErrors({ submit: error.message || 'Unable to submit incident report' })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#e5f6ff] text-slate-950">
      <main className="relative min-h-screen overflow-hidden px-3 pb-16 pt-[20vh] sm:px-4 md:px-8 sm:pt-[28vh] md:pt-[30vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})` }}
        />

        <section className="relative">
          <button
            type="button"
            onClick={goToReportsPage}
            className="absolute left-0 top-[-18vh] sm:top-[-24vh] flex h-9 w-9 items-center justify-center text-xl font-bold text-white/90 hover:text-white"
            aria-label="Back to reports"
          >
            &larr;
          </button>

          <div className="mx-auto w-full max-w-[650px] rounded-lg border border-[#2367bc] bg-white px-4 py-4 shadow-sm sm:px-6 md:px-7 sm:py-6">
            <>
              <h1 className="m-0 mb-6 text-center text-[16px] font-semibold uppercase leading-tight tracking-normal text-black">
                Online Incident Reporting Form
              </h1>

              <div className="space-y-3.5 text-[13px] font-bold text-black">
                <FormSection icon={<FaRegClipboard />} iconClassName="bg-white text-blue-600" title="1.Reporter's Details">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-16">
                    <CompactInput label="Full Name" value={formData.reporterName} error={errors.reporterName} onChange={(value) => setField('reporterName', value)} />
                    <CompactInput label="Contact Number" value={formData.contactNumber} error={errors.contactNumber} onChange={(value) => setField('contactNumber', value)} />
                  </div>
                </FormSection>

                <FormSection icon={<MdOutlineReportProblem />} iconClassName="bg-red-500 text-white" title="2. Basic Information (Incident Type & Time)">
                  <CompactSelect
                    label="Incident Category"
                    value={formData.incidentCategory}
                    error={errors.incidentCategory}
                    options={categories}
                    onChange={(value) => setField('incidentCategory', value)}
                  />
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-16">
                    <CompactInput type="date" label="Date & Time" value={formData.incidentDate} error={errors.incidentDate} onChange={(value) => setField('incidentDate', value)} />
                    <CompactInput type="time" label="Time" value={formData.incidentTime} error={errors.incidentTime} onChange={(value) => setField('incidentTime', value)} />
                  </div>
                </FormSection>

                <FormSection icon={<FiMapPin />} iconClassName="bg-amber-400 text-emerald-600" title="3. Location Details">
                  <CompactSelect label="District" value={formData.district} error={errors.district} options={districts} onChange={selectDistrict} />

                  <div className="mt-3">
                    <p className="mb-1 text-[12px] font-extrabold">Exact Location</p>
                    <div className="overflow-hidden rounded-lg bg-sky-100">
                      <div className="h-[190px]">
                        <MapContainer
                          center={formData.location ? [formData.location.lat, formData.location.lng] : [7.8731, 80.7718]}
                          zoom={formData.location ? 11 : 8}
                          markers={selectedMarker}
                          minHeight="190px"
                          onMapClick={(lat, lng) => setField('location', { lat, lng })}
                        />
                      </div>
                      <div className="bg-white px-4 py-1 text-[10px] leading-tight">
                        <p className="font-extrabold">Location</p>
                        <p>Sri Lanka Map</p>
                      </div>
                      <button type="button" onClick={useCurrentLocation} className="block w-full bg-[#d8d8d8] px-4 py-1 text-left text-[10px] font-extrabold text-black hover:bg-slate-300">
                        Set pin on map
                      </button>
                    </div>
                    {errors.location && <p className="mt-1 text-[12px] font-bold text-red-600">{errors.location}</p>}
                  </div>
                </FormSection>

                <FormSection icon={<FiCamera />} iconClassName="bg-sky-500 text-amber-500" title="4. Incident Photo (Upload or Capture)">
                  {photoPreviewUrl ? (
                    <div className="relative min-h-[130px] overflow-hidden rounded-lg bg-slate-100 shadow-md">
                      <img src={photoPreviewUrl} alt="Selected incident evidence" className="h-[130px] w-full object-cover" />
                      <button
                        type="button"
                        onClick={removeIncidentPhotos}
                        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-lg hover:bg-red-50"
                        aria-label="Remove selected incident photo"
                      >
                        <FiTrash2 size={22} />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer overflow-hidden rounded-lg bg-gradient-to-b from-[#737373] to-white px-4 py-4 text-white shadow-md">
                      <span className="text-[10px] font-bold">Image Capture/Upload</span>
                      <span className="flex min-h-[82px] flex-col items-center justify-center text-center text-black">
                        <FiCamera size={34} className="text-zinc-700" />
                        <span className="mt-1 text-[10px] font-extrabold">Upload/ Capture</span>
                      </span>
                      <input type="file" accept="image/*" multiple capture="environment" className="sr-only" onChange={(event) => selectIncidentPhotos(event.target.files)} />
                    </label>
                  )}
                  {formData.images.length > 0 && (
                    <p className="mt-2 truncate text-[11px] font-semibold text-slate-600">
                      {formData.images.length} file(s): {formData.images.map((file) => file.name).join(', ')}
                    </p>
                  )}
                </FormSection>

                {errors.submit && <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">{errors.submit}</p>}

                <div className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-14 px-3 pt-5">
                  <button type="button" onClick={submitReport} disabled={isSubmitting} className="h-9 rounded-lg bg-[#087af6] px-4 text-[12px] font-extrabold uppercase text-white hover:bg-[#0067d7] disabled:bg-slate-300">
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button
                    type="button"
                    onClick={goToReportsPage}
                    className="flex h-9 items-center justify-center rounded-lg bg-[#bdbdbd] px-4 text-[12px] font-extrabold uppercase text-white hover:bg-slate-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          </div>
        </section>
      </main>
    </div>
  )
}

function FormSection({ icon, iconClassName, title, children }) {
  return (
    <section className="grid grid-cols-[26px_1fr] gap-2">
      <span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${iconClassName}`}>{icon}</span>
      <div>
        <h2 className="mb-2 text-[13px] font-extrabold leading-tight text-black">{title}</h2>
        {children}
      </div>
    </section>
  )
}

function CompactInput({ label, value, onChange, error, type = 'text' }) {
  return (
    <label className="block min-w-0">
      <span className="block text-[11px] font-extrabold leading-tight text-black">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-7 w-full rounded-full border border-zinc-600 bg-white px-3 text-[12px] font-semibold text-black outline-none focus:border-[#087af6] focus:ring-2 focus:ring-sky-100"
      />
      {error && <span className="mt-1 block text-[11px] font-bold text-red-600">{error}</span>}
    </label>
  )
}

function CompactSelect({ label, value, onChange, error, options }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-extrabold leading-tight text-black">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-7 w-full rounded-lg border-0 bg-[#e6e6e6] px-3 text-[12px] font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-sky-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-[11px] font-bold text-red-600">{error}</span>}
    </label>
  )
}

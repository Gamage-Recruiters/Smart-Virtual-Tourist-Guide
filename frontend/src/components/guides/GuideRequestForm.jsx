import { Save, Send, Trash2 } from 'lucide-react'
import { DESCRIPTION_MAX_LENGTH, LOCATION_MAX_LENGTH, LONG_TEXT_MAX_LENGTH } from '../../utils/guideValidation'

const inputClass = 'mt-1 min-h-11 w-full rounded-lg border border-[#cbd9e4] bg-white px-3 text-sm outline-none transition focus:border-[#2e5c88] focus:ring-2 focus:ring-[#cde6fa] aria-[invalid=true]:border-[#e53935] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-[#e53935]'
const specialities = ['Historical tours', 'Cultural tours', 'Wildlife and nature', 'Adventure', 'Photography', 'Food tours', 'Religious sites', 'Family-friendly tours', 'Accessibility assistance']

function Field({ label, name, error, required, children }) {
  const errorId = `${name}-error`
  return (
    <label className="block text-sm font-bold text-[#29465d]">
      {label}{required && <span className="text-[#c72f27]"> *</span>}
      {children({ className: inputClass, errorId })}
      {error && <span id={errorId} className="mt-1 block text-xs font-medium text-[#c72f27]">{error}</span>}
    </label>
  )
}

export default function GuideRequestForm({ values, errors, onChange, onSubmit, onSaveDraft, onRequestClear, submitting }) {
  const setValue = (name) => (event) => onChange(name, event.target.type === 'checkbox' ? event.target.checked : event.target.value)
  const toggleSpeciality = (speciality) => {
    const selected = values.specialities.includes(speciality)
    onChange('specialities', selected ? values.specialities.filter((item) => item !== speciality) : [...values.specialities, speciality])
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <fieldset className="guide-card"><legend className="guide-legend">Trip details</legend>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Starting location" name="startLocation" error={errors.startLocation} required>{({ className, errorId }) => <input className={className} maxLength={LOCATION_MAX_LENGTH} value={values.startLocation} onChange={setValue('startLocation')} aria-invalid={Boolean(errors.startLocation)} aria-describedby={errors.startLocation ? errorId : undefined} />}</Field>
          <Field label="Main destination" name="destination" error={errors.destination} required>{({ className, errorId }) => <input className={className} maxLength={LOCATION_MAX_LENGTH} value={values.destination} onChange={setValue('destination')} aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? errorId : undefined} />}</Field>
          <Field label="Additional destinations or planned stops" name="stops" error={errors.stops}>{({ className, errorId }) => <input className={className} value={values.stops} onChange={setValue('stops')} placeholder="Dambulla, Kandy" aria-invalid={Boolean(errors.stops)} aria-describedby={errors.stops ? errorId : undefined} />}</Field>
          <Field label="Preferred start time" name="startTime">{({ className }) => <input className={className} type="time" value={values.startTime} onChange={setValue('startTime')} />}</Field>
          <Field label="Start date" name="startDate" error={errors.startDate} required>{({ className, errorId }) => <input className={className} type="date" value={values.startDate} onChange={setValue('startDate')} aria-invalid={Boolean(errors.startDate)} aria-describedby={errors.startDate ? errorId : undefined} />}</Field>
          <Field label="End date" name="endDate" error={errors.endDate} required>{({ className, errorId }) => <input className={className} type="date" value={values.endDate} onChange={setValue('endDate')} aria-invalid={Boolean(errors.endDate)} aria-describedby={errors.endDate ? errorId : undefined} />}</Field>
          <Field label="Number of adults" name="adults" error={errors.adults} required>{({ className, errorId }) => <input className={className} type="number" min="1" step="1" value={values.adults} onChange={setValue('adults')} aria-invalid={Boolean(errors.adults)} aria-describedby={errors.adults ? errorId : undefined} />}</Field>
          <Field label="Number of children" name="children" error={errors.children}>{({ className, errorId }) => <input className={className} type="number" min="0" step="1" value={values.children} onChange={setValue('children')} aria-invalid={Boolean(errors.children)} aria-describedby={errors.children ? errorId : undefined} />}</Field>
          <Field label="Pickup location" name="pickupLocation" error={errors.pickupLocation}>{({ className, errorId }) => <input className={className} maxLength={LOCATION_MAX_LENGTH} value={values.pickupLocation} onChange={setValue('pickupLocation')} aria-invalid={Boolean(errors.pickupLocation)} aria-describedby={errors.pickupLocation ? errorId : undefined} />}</Field>
          <Field label="Drop-off location" name="dropoffLocation" error={errors.dropoffLocation}>{({ className, errorId }) => <input className={className} maxLength={LOCATION_MAX_LENGTH} value={values.dropoffLocation} onChange={setValue('dropoffLocation')} aria-invalid={Boolean(errors.dropoffLocation)} aria-describedby={errors.dropoffLocation ? errorId : undefined} />}</Field>
        </div>
      </fieldset>

      <fieldset className="guide-card"><legend className="guide-legend">Guide preferences</legend>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Preferred language" name="preferredLanguage">{({ className }) => <select className={className} value={values.preferredLanguage} onChange={setValue('preferredLanguage')}><option>English</option><option>Sinhala</option><option>Tamil</option><option>French</option><option>German</option></select>}</Field>
          <Field label="Additional languages" name="additionalLanguages" error={errors.additionalLanguages}>{({ className, errorId }) => <input className={className} value={values.additionalLanguages} onChange={setValue('additionalLanguages')} placeholder="French, German" aria-invalid={Boolean(errors.additionalLanguages)} aria-describedby={errors.additionalLanguages ? errorId : undefined} />}</Field>
          <Field label="Minimum experience (years, optional)" name="minExperience" error={errors.minExperience}>{({ className, errorId }) => <input className={className} type="number" min="0" max="80" value={values.minExperience} onChange={setValue('minExperience')} aria-invalid={Boolean(errors.minExperience)} aria-describedby={errors.minExperience ? errorId : undefined} />}</Field>
          <Field label="Minimum rating (optional)" name="minRating" error={errors.minRating}>{({ className, errorId }) => <select className={className} value={values.minRating} onChange={setValue('minRating')} aria-invalid={Boolean(errors.minRating)} aria-describedby={errors.minRating ? errorId : undefined}><option value="">Any rating</option><option value="4">4.0+</option><option value="4.5">4.5+</option><option value="4.8">4.8+</option></select>}</Field>
        </div>
        <div className="mt-5"><p className="text-sm font-bold text-[#29465d]">Guide specialities</p><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{specialities.map((speciality) => <label key={speciality} className="flex min-h-11 items-center gap-3 rounded-lg border border-[#dbe5ed] px-3 text-sm"><input type="checkbox" checked={values.specialities.includes(speciality)} onChange={() => toggleSpeciality(speciality)} className="h-4 w-4 accent-[#2e5c88]" />{speciality}</label>)}</div></div>
        <label className="mt-4 flex min-h-11 items-center gap-3 rounded-lg border border-[#dbe5ed] px-3 text-sm"><input type="checkbox" checked={values.femaleGuidePreference} onChange={setValue('femaleGuidePreference')} className="h-4 w-4 accent-[#2e5c88]" />Prefer a female guide, if available (optional)</label>
      </fieldset>

      <fieldset className="guide-card"><legend className="guide-legend">Budget</legend><div className="grid gap-5 md:grid-cols-3">
        <Field label="Minimum budget (optional)" name="minBudget" error={errors.minBudget}>{({ className, errorId }) => <input className={className} type="number" min="0" value={values.minBudget} onChange={setValue('minBudget')} aria-invalid={Boolean(errors.minBudget)} aria-describedby={errors.minBudget ? errorId : undefined} />}</Field>
        <Field label="Maximum budget" name="maxBudget" error={errors.maxBudget} required>{({ className, errorId }) => <input className={className} type="number" min="1" value={values.maxBudget} onChange={setValue('maxBudget')} aria-invalid={Boolean(errors.maxBudget)} aria-describedby={errors.maxBudget ? errorId : undefined} />}</Field>
        <Field label="Currency" name="currency">{({ className }) => <select className={className} value={values.currency} onChange={setValue('currency')}><option>LKR</option><option>USD</option><option>EUR</option><option>GBP</option></select>}</Field>
      </div></fieldset>

      <fieldset className="guide-card"><legend className="guide-legend">Additional information</legend><div className="grid gap-5 md:grid-cols-2">
        <Field label="Short trip description" name="description" error={errors.description}>{({ className, errorId }) => <><textarea className={`${className} min-h-32 py-3`} maxLength={DESCRIPTION_MAX_LENGTH} value={values.description} onChange={setValue('description')} aria-invalid={Boolean(errors.description)} aria-describedby={`description-count${errors.description ? ` ${errorId}` : ''}`} /><span id="description-count" className="mt-1 block text-right text-xs text-[#718396]">{values.description.length}/{DESCRIPTION_MAX_LENGTH}</span></>}</Field>
        <Field label="Special requirements" name="specialRequirements" error={errors.specialRequirements}>{({ className, errorId }) => <textarea className={`${className} min-h-32 py-3`} maxLength={LONG_TEXT_MAX_LENGTH} value={values.specialRequirements} onChange={setValue('specialRequirements')} aria-invalid={Boolean(errors.specialRequirements)} aria-describedby={errors.specialRequirements ? errorId : undefined} />}</Field>
        <Field label="Mobility or accessibility needs" name="accessibilityNeeds" error={errors.accessibilityNeeds}>{({ className, errorId }) => <textarea className={`${className} min-h-24 py-3`} maxLength={LONG_TEXT_MAX_LENGTH} value={values.accessibilityNeeds} onChange={setValue('accessibilityNeeds')} placeholder="Only share details needed to plan the tour" aria-invalid={Boolean(errors.accessibilityNeeds)} aria-describedby={errors.accessibilityNeeds ? errorId : undefined} />}</Field>
        <Field label="Contact preference" name="contactPreference">{({ className }) => <select className={className} value={values.contactPreference} onChange={setValue('contactPreference')}><option>In-app messages</option><option>Email updates</option><option>Phone after booking</option></select>}</Field>
      </div></fieldset>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-[#dfe8ef] bg-white p-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onRequestClear} className="guide-button-secondary"><Trash2 aria-hidden="true" className="h-4 w-4" />Clear form</button>
        <button type="button" onClick={onSaveDraft} className="guide-button-secondary"><Save aria-hidden="true" className="h-4 w-4" />Save draft</button>
        <button type="submit" disabled={submitting} className="guide-button-primary"><Send aria-hidden="true" className="h-4 w-4" />{submitting ? 'Submitting…' : 'Submit request'}</button>
      </div>
    </form>
  )
}

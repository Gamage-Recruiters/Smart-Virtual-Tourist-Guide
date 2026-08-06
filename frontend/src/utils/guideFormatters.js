const safeNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const formatCurrency = (amount, currency = 'LKR') =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency || 'LKR',
    maximumFractionDigits: 0,
  }).format(safeNumber(amount))

export const formatDate = (value, options = {}) => {
  const date = value ? new Date(`${value}T00:00:00`) : null
  if (!date || Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Dates to be confirmed'
  const start = formatDate(startDate, { year: undefined })
  const end = formatDate(endDate, { year: undefined })
  return `${start} – ${end}`
}

export const isPastDate = (value) => {
  if (!value) return false
  const date = new Date(`${value}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Number.isNaN(date.getTime()) || date < today
}

export const isExpired = (value) => {
  const date = value ? new Date(value) : null
  return !date || Number.isNaN(date.getTime()) || date.getTime() <= Date.now()
}

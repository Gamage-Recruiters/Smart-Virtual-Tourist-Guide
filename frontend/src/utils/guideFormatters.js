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

const parseDisplayDate = (value) => {
  if (value instanceof Date) return new Date(value.getTime())
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00`)
  return value ? new Date(value) : null
}

export const formatDate = (value, options = {}) => {
  const date = parseDisplayDate(value)
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
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return `${start} – ${end}`
}

export const isPastDate = (value) => {
  if (!value) return false
  const date = parseDisplayDate(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Number.isNaN(date.getTime()) || date < today
}

export const isExpired = (value) => {
  const date = value ? new Date(value) : null
  return !date || Number.isNaN(date.getTime()) || date.getTime() <= Date.now()
}

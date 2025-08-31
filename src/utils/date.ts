import dayjs from 'dayjs'

export const formatDate = (dateString: string | Date): string => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

export const formatTime = (timeString: string | Date): string => {
  return dayjs(timeString).format('HH:mm')
}

export const formatDateTime = (dateString: string | Date): string => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}

export const formatDateForAPI = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const formatTimeForAPI = (time: string | Date | dayjs.Dayjs): string => {
  return dayjs(time).format('HH:mm')
}

export const isDateInPast = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs(), 'day')
}

export const formatDateRange = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return ''
  return `${formatDate(start)} - ${formatDate(end)}`
}

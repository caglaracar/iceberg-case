import dayjs from 'dayjs'

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return ''
  return dayjs(dateString).format('DD/MM/YYYY')
}

export const formatTime = (timeString: string | Date): string => {
  if (!timeString) return ''
  return dayjs(timeString).format('HH:mm')
}

export const getTimeUntilAppointment = (dateString: string): string => {
  if (!dateString) return ''
  
  const appointmentDate = dayjs(dateString)
  const now = dayjs()
  
  const diffInMinutes = appointmentDate.diff(now, 'minute')
  const diffInHours = appointmentDate.diff(now, 'hour')
  const diffInDays = appointmentDate.diff(now, 'day')
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min`
  } else if (diffInHours < 24) {
    return `${diffInHours} hours`
  } else if (diffInDays < 7) {
    return `${diffInDays} days`
  } else {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} weeks`
  }
}

export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address'
  return null
}

export const validatePhone = (phone: string): string | null => {
  if (!phone?.trim()) return 'Phone number is required'
  // Basic phone validation - can be enhanced
  if (phone.length < 10) return 'Phone number must be at least 10 digits'
  return null
}

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value?.trim()) return `${fieldName} is required`
  return null
}

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  Object.entries(rules).forEach(([field, validator]) => {
    const error = validator(data[field])
    if (error) {
      errors[field] = error
    }
  })
  
  return errors
}

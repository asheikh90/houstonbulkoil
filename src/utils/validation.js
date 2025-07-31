export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  // Check if it's 10 digits (US format)
  return cleanPhone.length === 10
}

export const formatPhone = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Don't format if it's not a valid length
  if (cleanPhone.length === 0) return phone
  
  // Format as user types
  if (cleanPhone.length <= 3) {
    return cleanPhone
  } else if (cleanPhone.length <= 6) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3)}`
  } else if (cleanPhone.length <= 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
  } else {
    // Limit to 10 digits and format
    const limited = cleanPhone.slice(0, 10)
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
  }
}

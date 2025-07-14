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
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
  }
  return phone
}

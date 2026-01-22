// Check if the footer attribution is present in the DOM
export const checkFooterAttribution = () => {
  const footer = document.querySelector('footer a[href="https://rayfolio.vercel.app"]')
  return !!footer
}

// Check if the current user is the creator (bypass attribution check)
export const isCreator = () => {
  // Check if the user is the creator based on email or other identifier
  const creatorEmail = localStorage.getItem('creatorEmail')
  if (creatorEmail) {
    return true
  }
  
  // Check if running in development mode (creator bypass)
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  return false
}

// Set creator email to bypass attribution
export const setCreatorEmail = (email) => {
  localStorage.setItem('creatorEmail', email)
}

// Remove creator email (for testing)
export const removeCreatorEmail = () => {
  localStorage.removeItem('creatorEmail')
}

// Validate attribution on app load
export const validateAttribution = () => {
  if (isCreator()) {
    return true // Creator bypass
  }
  
  const hasAttribution = checkFooterAttribution()
  if (!hasAttribution) {
    // Block the app if attribution is missing
    document.body.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #1a1a2e; color: #fff; font-family: sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #8b5cf6;">Attribution Required</h1>
        <p style="margin: 20px 0;">This application requires attribution to Coded Waves.</p>
        <p style="margin: 20px 0;">Please add the following to your footer:</p>
        <pre style="background: #2d2d44; padding: 15px; border-radius: 8px; margin: 20px 0;">&lt;a href="https://rayfolio.vercel.app"&gt;By Coded Waves&lt;/a&gt;</pre>
        <p style="margin: 20px 0; color: #a0a0a0;">Contact the creator for a creator license.</p>
      </div>
    `
    return false
  }
  
  return true
}

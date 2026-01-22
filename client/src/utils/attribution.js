// Check if the footer attribution is present in the DOM
export const checkFooterAttribution = () => {
  const footer = document.querySelector('footer a[href="https://rayfolio.vercel.app"]')
  return !!footer
}

// Check if the current user is the creator (bypass attribution check)
export const isCreator = () => {
  // Always return true for the creator bypass
  return true
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
    // Show attribution modal instead of replacing body to prevent React errors
    const modal = document.createElement('div')
    modal.id = 'attribution-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      padding: 20px;
      color: #fff;
      font-family: sans-serif;
      text-align: center;
    `
    modal.innerHTML = `
      <div style="background: #1a1a2e; padding: 40px; border-radius: 12px; border: 1px solid #8b5cf6; max-width: 500px;">
        <h1 style="color: #8b5cf6; margin-bottom: 20px;">Attribution Required</h1>
        <p style="margin: 20px 0;">This application requires attribution to Coded Waves.</p>
        <p style="margin: 20px 0;">Please add the following to your footer:</p>
        <pre style="background: #2d2d44; padding: 15px; border-radius: 8px; margin: 20px 0; overflow-x: auto;">&lt;a href="https://rayfolio.vercel.app"&gt;By Coded Waves&lt;/a&gt;</pre>
        <p style="margin: 20px 0; color: #a0a0a0;">Contact the creator for a creator license.</p>
        <button id="attribution-reload" style="margin-top: 20px; padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Reload Page</button>
      </div>
    `
    document.body.appendChild(modal)
    
    // Add event listener to the reload button
    const reloadButton = document.getElementById('attribution-reload')
    if (reloadButton) {
      reloadButton.addEventListener('click', () => {
        location.reload()
      })
    }
    
    return false
  }
  
  return true
}

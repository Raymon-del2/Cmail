// Check if the footer attribution is present in the DOM
export const checkFooterAttribution = () => {
  const footer = document.querySelector('footer a[href="https://rayfolio.vercel.app"]')
  return !!footer
}

// Validate attribution on app load
export const validateAttribution = () => {
  // Check if pro mode is enabled via environment variable
  if (process.env.CMAIL_PRO_MODE === 'true') {
    return true // Pro mode - skip attribution check
  }
  
  // Wait for React to finish rendering before checking
  const checkInterval = setInterval(() => {
    const hasAttribution = checkFooterAttribution()
    if (hasAttribution) {
      clearInterval(checkInterval)
      return // Attribution found, no need to show modal
    }
    
    // Check if we've waited too long (5 seconds)
    if (checkInterval._timeout) {
      clearInterval(checkInterval)
      // Show modal if attribution not found after 5 seconds
      showAttributionModal()
    }
  }, 100)
  
  // Set timeout to prevent infinite loop
  setTimeout(() => {
    checkInterval._timeout = true
  }, 5000)
  
  return true
}

// Show attribution modal
const showAttributionModal = () => {
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
      <pre style="background: #2d2d44; padding: 15px; border-radius: 8px; margin: 20px 0; overflow-x: auto;">&lt;a href="https://rayfolio.vercel.app"&gt;Powered by C-mail {year}&lt;/a&gt;</pre>
      <p style="margin: 20px 0; color: #a0a0a0;">If you need a white-label version or custom branding, check out CMail Pro.</p>
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
}

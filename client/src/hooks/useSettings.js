import { useState, useEffect } from 'react'

export const useSettings = () => {
  const loadSettings = () => {
    const saved = localStorage.getItem('cmailSettings')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      // General
      language: 'en',
      timezone: 'auto',
      
      // Notifications
      emailNotifications: true,
      desktopNotifications: false,
      soundEnabled: true,
      
      // Email
      conversationView: true,
      autoAdvance: 'next',
      undoSend: 5,
      defaultReply: 'replyAll',
      
      // Privacy
      readReceipts: false,
      externalImages: 'ask',
      
      // Display
      density: 'comfortable',
      previewPane: 'right',
    }
  }

  const [settings, setSettings] = useState(loadSettings())

  useEffect(() => {
    localStorage.setItem('cmailSettings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    localStorage.removeItem('cmailSettings')
    setSettings(loadSettings())
  }

  return {
    settings,
    updateSetting,
    resetSettings
  }
}

// Helper function to show desktop notification
export const showDesktopNotification = (title, options = {}) => {
  const settings = JSON.parse(localStorage.getItem('cmailSettings') || '{}')
  
  if (!settings.desktopNotifications) return
  
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    })
  }
}

// Helper function to play notification sound
export const playNotificationSound = () => {
  const settings = JSON.parse(localStorage.getItem('cmailSettings') || '{}')
  
  if (!settings.soundEnabled) return
  
  const audio = new Audio('/notification.mp3')
  audio.volume = 0.5
  audio.play().catch(err => console.log('Could not play sound:', err))
}

// Helper function to format time based on timezone setting
export const formatTime = (date, timezone = 'auto') => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  
  if (timezone !== 'auto') {
    options.timeZone = getTimeZone(timezone)
  }
  
  return new Date(date).toLocaleTimeString('en-US', options)
}

// Helper function to get timezone string
const getTimeZone = (tz) => {
  const timezones = {
    utc: 'UTC',
    est: 'America/New_York',
    cst: 'America/Chicago',
    mst: 'America/Denver',
    pst: 'America/Los_Angeles',
    gmt: 'Europe/London',
    cet: 'Europe/Paris'
  }
  return timezones[tz] || 'UTC'
}

export default useSettings

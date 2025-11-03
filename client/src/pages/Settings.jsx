import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Bell, Moon, Globe, Palette, Mail, 
  Shield, Eye, Database, Keyboard, Zap, Check, Save
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'

const Settings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [saveMessage, setSaveMessage] = useState('')
  
  // Load settings from localStorage
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
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cmailSettings', JSON.stringify(settings))
    setSaveMessage('Settings saved automatically')
    const timer = setTimeout(() => setSaveMessage(''), 2000)
    return () => clearTimeout(timer)
  }, [settings])
  
  // Request notification permission when enabled
  useEffect(() => {
    if (settings.desktopNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [settings.desktopNotifications])

  const tabs = [
    { id: 'general', name: 'General', icon: Zap },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'display', name: 'Display', icon: Palette },
    { id: 'shortcuts', name: 'Keyboard shortcuts', icon: Keyboard },
  ]

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/inbox')}
              className="p-2 hover:bg-dark-bg rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <CmailLogo />
            <h1 className="text-xl font-normal ml-4">Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Check className="w-4 h-4" />
                <span>{saveMessage}</span>
              </div>
            )}
            <span className="text-sm text-dark-text-secondary">{user?.email}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cmail-purple/20 text-cmail-purple'
                        : 'hover:bg-dark-card text-dark-text'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-9">
            {activeTab === 'general' && (
              <GeneralSettings settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === 'notifications' && (
              <NotificationSettings settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === 'email' && (
              <EmailSettings settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === 'privacy' && (
              <PrivacySettings settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === 'display' && (
              <DisplaySettings settings={settings} updateSetting={updateSetting} />
            )}
            {activeTab === 'shortcuts' && <ShortcutsSettings />}
          </main>
        </div>
      </div>
    </div>
  )
}

// General Settings
const GeneralSettings = ({ settings, updateSetting }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">General</h2>
        <p className="text-dark-text-secondary">Manage your general preferences</p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <SettingRow
          label="Language"
          description="Choose your preferred language"
        >
          <select
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Timezone"
          description="Set your timezone"
        >
          <select
            value={settings.timezone}
            onChange={(e) => updateSetting('timezone', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="auto">Auto-detect</option>
            <option value="utc">UTC</option>
            <option value="est">Eastern Time (EST)</option>
            <option value="cst">Central Time (CST)</option>
            <option value="mst">Mountain Time (MST)</option>
            <option value="pst">Pacific Time (PST)</option>
            <option value="gmt">GMT</option>
            <option value="cet">Central European Time</option>
          </select>
        </SettingRow>
      </div>
    </div>
  )
}

// Notification Settings
const NotificationSettings = ({ settings, updateSetting }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Notifications</h2>
        <p className="text-dark-text-secondary">Manage how you receive notifications</p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <ToggleRow
          label="Email notifications"
          description="Receive notifications via email"
          checked={settings.emailNotifications}
          onChange={(checked) => updateSetting('emailNotifications', checked)}
        />

        <ToggleRow
          label="Desktop notifications"
          description="Show desktop notifications for new emails"
          checked={settings.desktopNotifications}
          onChange={(checked) => updateSetting('desktopNotifications', checked)}
        />

        <ToggleRow
          label="Sound"
          description="Play sound for new emails"
          checked={settings.soundEnabled}
          onChange={(checked) => updateSetting('soundEnabled', checked)}
        />
      </div>
    </div>
  )
}

// Email Settings
const EmailSettings = ({ settings, updateSetting }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Email</h2>
        <p className="text-dark-text-secondary">Customize your email experience</p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <ToggleRow
          label="Conversation view"
          description="Group emails by conversation"
          checked={settings.conversationView}
          onChange={(checked) => updateSetting('conversationView', checked)}
        />

        <SettingRow
          label="Auto-advance"
          description="What to show after deleting or archiving"
        >
          <select
            value={settings.autoAdvance}
            onChange={(e) => updateSetting('autoAdvance', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="next">Next email</option>
            <option value="previous">Previous email</option>
            <option value="list">Back to list</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Undo send"
          description="Time to cancel sending"
        >
          <select
            value={settings.undoSend}
            onChange={(e) => updateSetting('undoSend', parseInt(e.target.value))}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
            <option value="20">20 seconds</option>
            <option value="30">30 seconds</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Default reply behavior"
          description="How to reply to emails"
        >
          <select
            value={settings.defaultReply}
            onChange={(e) => updateSetting('defaultReply', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="reply">Reply</option>
            <option value="replyAll">Reply all</option>
          </select>
        </SettingRow>
      </div>
    </div>
  )
}

// Privacy Settings
const PrivacySettings = ({ settings, updateSetting }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Privacy</h2>
        <p className="text-dark-text-secondary">Control your privacy settings</p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <ToggleRow
          label="Read receipts"
          description="Let senders know when you've read their email"
          checked={settings.readReceipts}
          onChange={(checked) => updateSetting('readReceipts', checked)}
        />

        <SettingRow
          label="External images"
          description="How to handle images from external sources"
        >
          <select
            value={settings.externalImages}
            onChange={(e) => updateSetting('externalImages', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="always">Always show</option>
            <option value="ask">Ask before showing</option>
            <option value="never">Never show</option>
          </select>
        </SettingRow>
      </div>
    </div>
  )
}

// Display Settings
const DisplaySettings = ({ settings, updateSetting }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Display</h2>
        <p className="text-dark-text-secondary">Customize how emails are displayed</p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <SettingRow
          label="Display density"
          description="Amount of information shown"
        >
          <select
            value={settings.density}
            onChange={(e) => updateSetting('density', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="default">Default</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Preview pane"
          description="Show email preview"
        >
          <select
            value={settings.previewPane}
            onChange={(e) => updateSetting('previewPane', e.target.value)}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
          >
            <option value="right">Right side</option>
            <option value="bottom">Bottom</option>
            <option value="off">Off</option>
          </select>
        </SettingRow>
      </div>
    </div>
  )
}

// Shortcuts Settings
const ShortcutsSettings = () => {
  const shortcuts = [
    { key: 'C', description: 'Compose new email' },
    { key: 'R', description: 'Reply to email' },
    { key: 'A', description: 'Reply all' },
    { key: 'F', description: 'Forward email' },
    { key: 'E', description: 'Archive' },
    { key: '#', description: 'Delete' },
    { key: 'S', description: 'Star email' },
    { key: '/', description: 'Search' },
    { key: 'G then I', description: 'Go to Inbox' },
    { key: 'G then S', description: 'Go to Starred' },
    { key: 'G then T', description: 'Go to Sent' },
    { key: 'G then D', description: 'Go to Drafts' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Keyboard shortcuts</h2>
        <p className="text-dark-text-secondary">Use keyboard shortcuts to navigate faster</p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                <span className="text-dark-text-secondary">{shortcut.description}</span>
                <kbd className="px-3 py-1 bg-dark-card border border-dark-border rounded text-sm font-mono text-cmail-purple">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
const SettingRow = ({ label, description, children }) => {
  return (
    <div className="flex items-center justify-between p-6">
      <div>
        <div className="font-medium mb-1">{label}</div>
        <div className="text-sm text-dark-text-secondary">{description}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}

const ToggleRow = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-6">
      <div>
        <div className="font-medium mb-1">{label}</div>
        <div className="text-sm text-dark-text-secondary">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-cmail-purple' : 'bg-dark-border'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'transform translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  )
}

export default Settings

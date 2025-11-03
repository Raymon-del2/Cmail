import { useState, useEffect } from 'react'
import { Plus, Copy, Eye, EyeOff, Trash2, ExternalLink, Code } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const DeveloperDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSecrets, setShowSecrets] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    redirectUris: [''],
    scopes: ['email', 'profile']
  })

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const response = await axios.get('/api/oauth/apps')
      setApps(response.data.apps)
    } catch (error) {
      console.error('Error fetching apps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/oauth/apps/register', formData)
      setApps([response.data.app, ...apps])
      setShowCreateModal(false)
      setFormData({
        name: '',
        description: '',
        website: '',
        redirectUris: [''],
        scopes: ['email', 'profile']
      })
    } catch (error) {
      console.error('Error creating app:', error)
      alert(error.response?.data?.message || 'Error creating app')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const toggleSecret = (appId) => {
    setShowSecrets(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }))
  }

  const addRedirectUri = () => {
    setFormData({
      ...formData,
      redirectUris: [...formData.redirectUris, '']
    })
  }

  const updateRedirectUri = (index, value) => {
    const newUris = [...formData.redirectUris]
    newUris[index] = value
    setFormData({ ...formData, redirectUris: newUris })
  }

  const removeRedirectUri = (index) => {
    const newUris = formData.redirectUris.filter((_, i) => i !== index)
    setFormData({ ...formData, redirectUris: newUris })
  }

  const toggleScope = (scope) => {
    const newScopes = formData.scopes.includes(scope)
      ? formData.scopes.filter(s => s !== scope)
      : [...formData.scopes, scope]
    setFormData({ ...formData, scopes: newScopes })
  }

  const availableScopes = [
    { value: 'email', label: 'Email Address', description: 'Access user email address' },
    { value: 'profile', label: 'Profile', description: 'Access user profile information' },
    { value: 'read_emails', label: 'Read Emails', description: 'Read user emails' },
    { value: 'send_emails', label: 'Send Emails', description: 'Send emails on behalf of user' },
    { value: 'manage_emails', label: 'Manage Emails', description: 'Full email management access' }
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark-text">Developer Dashboard</h1>
              <p className="text-dark-text-secondary mt-1">
                Integrate Cmail authentication into your apps
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cmail-purple mx-auto"></div>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-text mb-2">No apps yet</h3>
            <p className="text-dark-text-secondary mb-6">
              Create your first app to start integrating Cmail authentication
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First App
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {apps.map((app) => (
              <div key={app._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text">{app.name}</h3>
                    <p className="text-dark-text-secondary text-sm mt-1">{app.description}</p>
                    <a
                      href={app.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cmail-purple text-sm flex items-center space-x-1 mt-2 hover:underline"
                    >
                      <span>{app.website}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      app.isActive ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                    }`}>
                      {app.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Client ID */}
                  <div>
                    <label className="block text-sm text-dark-text-secondary mb-2">Client ID</label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 px-4 py-2 bg-dark-bg rounded-lg text-dark-text font-mono text-sm">
                        {app.clientId}
                      </code>
                      <button
                        onClick={() => copyToClipboard(app.clientId)}
                        className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                      >
                        <Copy className="w-5 h-5 text-dark-text-secondary" />
                      </button>
                    </div>
                  </div>

                  {/* Client Secret */}
                  {app.clientSecret && (
                    <div>
                      <label className="block text-sm text-dark-text-secondary mb-2">Client Secret</label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-4 py-2 bg-dark-bg rounded-lg text-dark-text font-mono text-sm">
                          {showSecrets[app._id] ? app.clientSecret : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => toggleSecret(app._id)}
                          className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                        >
                          {showSecrets[app._id] ? (
                            <EyeOff className="w-5 h-5 text-dark-text-secondary" />
                          ) : (
                            <Eye className="w-5 h-5 text-dark-text-secondary" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(app.clientSecret)}
                          className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                        >
                          <Copy className="w-5 h-5 text-dark-text-secondary" />
                        </button>
                      </div>
                      <p className="text-xs text-yellow-400 mt-2">
                        ⚠️ Keep this secret secure! Don't share it publicly.
                      </p>
                    </div>
                  )}

                  {/* Redirect URIs */}
                  <div>
                    <label className="block text-sm text-dark-text-secondary mb-2">Redirect URIs</label>
                    <div className="space-y-2">
                      {app.redirectUris.map((uri, index) => (
                        <div key={index} className="px-4 py-2 bg-dark-bg rounded-lg text-dark-text text-sm">
                          {uri}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scopes */}
                  <div>
                    <label className="block text-sm text-dark-text-secondary mb-2">Scopes</label>
                    <div className="flex flex-wrap gap-2">
                      {app.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="px-3 py-1 bg-cmail-purple/20 text-cmail-purple rounded-full text-xs"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="pt-4 border-t border-dark-border">
                    <p className="text-sm text-dark-text-secondary">
                      <span className="font-semibold text-dark-text">{app.usageCount || 0}</span> authorizations
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create App Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border">
              <h2 className="text-xl font-semibold text-dark-text">Create New App</h2>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-6">
              {/* App Name */}
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">App Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="My Awesome App"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="A brief description of your app"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Website URL *</label>
                <input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-field"
                  placeholder="https://myapp.com"
                />
              </div>

              {/* Redirect URIs */}
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Redirect URIs *</label>
                <div className="space-y-2">
                  {formData.redirectUris.map((uri, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="url"
                        required
                        value={uri}
                        onChange={(e) => updateRedirectUri(index, e.target.value)}
                        className="input-field flex-1"
                        placeholder="https://myapp.com/auth/callback"
                      />
                      {formData.redirectUris.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRedirectUri(index)}
                          className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addRedirectUri}
                  className="mt-2 text-sm text-cmail-purple hover:underline"
                >
                  + Add another URI
                </button>
              </div>

              {/* Scopes */}
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">Scopes *</label>
                <div className="space-y-2">
                  {availableScopes.map((scope) => (
                    <label
                      key={scope.value}
                      className="flex items-start space-x-3 p-3 hover:bg-dark-hover rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.scopes.includes(scope.value)}
                        onChange={() => toggleScope(scope.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-dark-text font-medium">{scope.label}</div>
                        <div className="text-dark-text-secondary text-sm">{scope.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeveloperDashboard

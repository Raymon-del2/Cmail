import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu, Search, Settings, HelpCircle, Grid3x3, User,
  Pencil, Inbox as InboxIcon, Star, Clock, Send, File, Trash2,
  MoreVertical, RefreshCw, ChevronDown, ChevronUp, Plus,
  Mail, AlertOctagon, Calendar, Tag, Tags, ShoppingBag
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'
import ComposeEmail from '../components/ComposeEmail'
import CreateLabelModal from '../components/CreateLabelModal'

const ManageLabels = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [labels, setLabels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showCreateLabel, setShowCreateLabel] = useState(false)

  useEffect(() => {
    fetchLabels()
  }, [])

  const fetchLabels = async () => {
    try {
      setLoading(true)
      
      // Get user's labels from backend
      const labelsResponse = await axios.get('/api/labels')
      const userLabels = labelsResponse.data.labels || []
      
      // Get all emails to count label usage
      const emailsResponse = await axios.get('/api/emails/all')
      const emails = emailsResponse.data.emails || []
      
      // Count how many emails have each label
      const labelCounts = new Map()
      emails.forEach(email => {
        if (email.labels && email.labels.length > 0) {
          email.labels.forEach(label => {
            labelCounts.set(label, (labelCounts.get(label) || 0) + 1)
          })
        }
      })

      // Combine user labels with counts
      const labelArray = userLabels.map(label => ({
        ...label,
        count: labelCounts.get(label.name) || 0
      }))

      setLabels(labelArray)
    } catch (error) {
      console.error('Error fetching labels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLabel = async (labelId, labelName) => {
    if (window.confirm(`Are you sure you want to delete the label "${labelName}"?`)) {
      try {
        await axios.delete(`/api/labels/${labelId}`)
        fetchLabels()
      } catch (error) {
        console.error('Error deleting label:', error)
        alert('Failed to delete label')
      }
    }
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Menu className="w-6 h-6 text-dark-text" />
          </button>
          <CmailLogo size="sm" />
          <span className="text-xl font-normal text-dark-text">C-mail</span>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search mail"
              className="w-full pl-12 pr-4 py-3 bg-dark-card text-dark-text rounded-full focus:outline-none focus:ring-2 focus:ring-cmail-purple border border-dark-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Settings className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Grid3x3 className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button 
            onClick={logout}
            className="p-2 hover:bg-dark-card rounded-full transition-colors"
          >
            <User className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-dark-border p-2 overflow-y-auto">
          <button 
            onClick={() => setShowCompose(true)}
            className="flex items-center space-x-3 px-4 py-3 mb-4 bg-cmail-purple hover:bg-cmail-purple-dark text-white rounded-full shadow-lg transition-all"
          >
            <Pencil className="w-5 h-5" />
            <span className="font-medium">Compose</span>
          </button>

          <nav className="space-y-1">
            <button 
              onClick={() => navigate('/inbox')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <InboxIcon className="w-5 h-5" />
              <span>Inbox</span>
            </button>
            <button 
              onClick={() => navigate('/starred')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <Star className="w-5 h-5" />
              <span>Starred</span>
            </button>
            <button 
              onClick={() => navigate('/snoozed')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <Clock className="w-5 h-5" />
              <span>Snoozed</span>
            </button>
            <button 
              onClick={() => navigate('/sent')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Sent</span>
            </button>
            <button 
              onClick={() => navigate('/drafts')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <File className="w-5 h-5" />
              <span>Drafts</span>
            </button>
            
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              {showMoreMenu ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <span>{showMoreMenu ? 'Less' : 'More'}</span>
            </button>

            {showMoreMenu && (
              <>
                <button 
                  onClick={() => navigate('/important')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Tag className="w-5 h-5" />
                  <span>Important</span>
                </button>
                <button 
                  onClick={() => navigate('/scheduled')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Scheduled</span>
                </button>
                <button 
                  onClick={() => navigate('/all')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>All Mail</span>
                </button>
                <button 
                  onClick={() => navigate('/spam')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <AlertOctagon className="w-5 h-5" />
                  <span>Spam</span>
                </button>
                <button 
                  onClick={() => navigate('/trash')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Trash</span>
                </button>
                <div className="h-px bg-dark-border my-2"></div>
                <button 
                  onClick={() => navigate('/subscriptions')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Manage subscriptions</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full bg-cmail-purple/20 text-cmail-purple font-medium">
                  <Tags className="w-5 h-5" />
                  <span>Manage labels</span>
                </button>
                <button 
                  onClick={() => setShowCreateLabel(true)}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create new label</span>
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
            <div className="flex items-center gap-4">
              <Tags className="w-5 h-5 text-dark-text" />
              <h1 className="text-xl font-normal text-dark-text">Manage Labels</h1>
              <span className="text-sm text-dark-text-secondary">({labels.length})</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCreateLabel(true)}
                className="px-4 py-2 bg-cmail-purple text-white rounded-lg hover:bg-cmail-purple-dark transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create new label</span>
              </button>
              <button 
                onClick={fetchLabels}
                className="p-2 hover:bg-dark-card rounded-full transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-dark-text-secondary" />
              </button>
              <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-dark-text-secondary" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-dark-text-secondary">Loading labels...</div>
                </div>
              ) : labels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-dark-text-secondary">
                  <Tag className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg mb-4">No labels created yet</p>
                  <button
                    onClick={() => setShowCreateLabel(true)}
                    className="px-6 py-3 bg-cmail-purple text-white rounded-full hover:bg-cmail-purple-dark transition-colors"
                  >
                    Create your first label
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {labels.map((label, index) => (
                    <div
                      key={index}
                      className="bg-dark-card border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-cmail-purple transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Tag className="w-5 h-5 text-cmail-purple" />
                        <div>
                          <h3 className="text-dark-text font-medium">{label.name}</h3>
                          <p className="text-dark-text-secondary text-sm">
                            {label.count} {label.count === 1 ? 'email' : 'emails'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/label/${label.name}`)}
                          className="px-3 py-1 text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteLabel(label._id, label.name)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-dark-bg rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Compose Modal */}
      <ComposeEmail 
        isOpen={showCompose} 
        onClose={() => setShowCompose(false)}
        onSent={() => setShowCompose(false)}
      />

      {/* Create Label Modal */}
      <CreateLabelModal
        isOpen={showCreateLabel}
        onClose={() => setShowCreateLabel(false)}
        onLabelCreated={(labelName) => {
          console.log('Label created:', labelName)
          fetchLabels()
        }}
      />
    </div>
  )
}

export default ManageLabels

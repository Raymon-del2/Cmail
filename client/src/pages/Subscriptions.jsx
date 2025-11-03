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

const Subscriptions = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showCreateLabel, setShowCreateLabel] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      // Get all emails and extract unique senders
      const response = await axios.get('/api/emails/all')
      const emails = response.data.emails || []
      
      // Group by sender email
      const senderMap = new Map()
      emails.forEach(email => {
        if (email.from?.email) {
          const key = email.from.email
          if (!senderMap.has(key)) {
            senderMap.set(key, {
              email: email.from.email,
              name: `${email.from.firstName} ${email.from.lastName}`,
              count: 0
            })
          }
          senderMap.get(key).count++
        }
      })

      // Convert to array and sort by count
      const subs = Array.from(senderMap.values())
        .sort((a, b) => b.count - a.count)
      
      setSubscriptions(subs)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
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
                <button className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full bg-cmail-purple/20 text-cmail-purple font-medium">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Manage subscriptions</span>
                </button>
                <button 
                  onClick={() => navigate('/labels')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
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
              <ShoppingBag className="w-5 h-5 text-dark-text" />
              <h1 className="text-xl font-normal text-dark-text">Subscriptions</h1>
              <span className="text-sm text-dark-text-secondary">({subscriptions.length})</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={fetchSubscriptions}
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
              <p className="text-dark-text-secondary mb-6">
                When you unsubscribe, it can take senders a few days to stop sending you messages
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-dark-text-secondary">Loading subscriptions...</div>
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-dark-text-secondary">
                  <Mail className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">No subscriptions found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subscriptions.map((sub, index) => (
                    <div
                      key={index}
                      className="bg-dark-card border border-dark-border rounded-lg p-4 flex items-center justify-between hover:border-cmail-purple transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cmail-purple rounded-full flex items-center justify-center text-white font-semibold">
                          {sub.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-dark-text font-medium">{sub.name}</h3>
                          <p className="text-dark-text-secondary text-sm">{sub.email}</p>
                          <p className="text-dark-text-secondary text-xs mt-1">
                            {sub.count} {sub.count === 1 ? 'email' : 'emails'} recently
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-cmail-purple hover:bg-dark-bg rounded-lg transition-colors">
                        Unsubscribe
                      </button>
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
        }}
      />
    </div>
  )
}

export default Subscriptions

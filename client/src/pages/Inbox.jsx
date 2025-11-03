import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Menu, Search, Settings, HelpCircle, Grid3x3, User, 
  Pencil, Inbox as InboxIcon, Star, Clock, Send, File, Trash2,
  MoreVertical, ChevronLeft, ChevronRight, RefreshCw,
  Archive, AlertCircle, Tag, ChevronDown, ChevronUp, Plus,
  Mail, AlertOctagon, Calendar, Tags, ShoppingBag
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'
import ComposeEmail from '../components/ComposeEmail'
import CreateLabelModal from '../components/CreateLabelModal'
import ProfileMenu from '../components/ProfileMenu'
import Loader from '../components/Loader'
import ProfileLoader from '../components/ProfileLoader'
import MobileNav from '../components/MobileNav'
import MobileHeader from '../components/MobileHeader'
import MobileMenu from '../components/MobileMenu'

const Inbox = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [selectedEmails, setSelectedEmails] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [activeCategory, setActiveCategory] = useState('primary')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showCreateLabel, setShowCreateLabel] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Fetch emails
  useEffect(() => {
    fetchEmails()
  }, [activeCategory])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMoreOptions && !e.target.closest('.more-options-menu')) {
        setShowMoreOptions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMoreOptions])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/emails/inbox?category=${activeCategory}`)
      setEmails(response.data.emails)
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    
    if (!query) {
      fetchEmails()
      return
    }

    const filtered = emails.filter(email => 
      email.subject?.toLowerCase().includes(query) ||
      email.body?.toLowerCase().includes(query) ||
      email.from?.firstName?.toLowerCase().includes(query) ||
      email.from?.lastName?.toLowerCase().includes(query) ||
      email.from?.email?.toLowerCase().includes(query)
    )
    setEmails(filtered)
  }

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const toggleEmailSelection = (emailId) => {
    setSelectedEmails(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    )
  }

  const toggleStar = async (emailId, e) => {
    e.stopPropagation()
    try {
      await axios.patch(`/api/emails/${emailId}/star`)
      fetchEmails()
    } catch (error) {
      console.error('Failed to toggle star:', error)
    }
  }

  const handleArchive = async () => {
    try {
      // Archive selected emails
      await Promise.all(
        selectedEmails.map(emailId => 
          axios.patch(`/api/emails/${emailId}`, { isArchived: true })
        )
      )
      setSelectedEmails([])
      fetchEmails()
    } catch (error) {
      console.error('Failed to archive emails:', error)
    }
  }

  const handleSnooze = async () => {
    try {
      // Snooze selected emails
      await Promise.all(
        selectedEmails.map(emailId => 
          axios.patch(`/api/emails/${emailId}`, { isSnoozed: true })
        )
      )
      setSelectedEmails([])
      fetchEmails()
    } catch (error) {
      console.error('Failed to snooze emails:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete ${selectedEmails.length} email(s)?`)) {
      try {
        // Delete selected emails
        await Promise.all(
          selectedEmails.map(emailId => 
            axios.delete(`/api/emails/${emailId}`)
          )
        )
        setSelectedEmails([])
        fetchEmails()
      } catch (error) {
        console.error('Failed to delete emails:', error)
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        selectedEmails.map(emailId => 
          axios.patch(`/api/emails/${emailId}/read`)
        )
      )
      setSelectedEmails([])
      fetchEmails()
      setShowMoreOptions(false)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAsImportant = async () => {
    try {
      await Promise.all(
        selectedEmails.map(emailId => 
          axios.patch(`/api/emails/${emailId}/important`)
        )
      )
      setSelectedEmails([])
      fetchEmails()
      setShowMoreOptions(false)
    } catch (error) {
      console.error('Failed to mark as important:', error)
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const emailDate = new Date(date)
    const diffMs = now - emailDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return emailDate.toLocaleDateString()
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Mobile Header */}
      <MobileHeader 
        onMenuOpen={() => setShowMobileMenu(true)}
        title="Inbox"
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu 
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />

      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-4 py-2 border-b border-dark-border">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Menu className="w-6 h-6 text-dark-text" />
          </button>
          <div className="flex items-center space-x-2">
            <CmailLogo size="sm" />
            <span className="text-xl text-dark-text font-normal">C-mail</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search mail"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-dark-card text-dark-text rounded-full border border-dark-border focus:outline-none focus:ring-2 focus:ring-cmail-purple placeholder-dark-text-secondary"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-dark-card rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Grid3x3 className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <ProfileMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-dark-border p-2 overflow-y-auto">
          {/* Compose Button */}
          <button 
            onClick={() => setShowCompose(true)}
            className="flex items-center space-x-3 px-4 py-3 mb-4 bg-cmail-purple hover:bg-cmail-purple-dark text-white rounded-full shadow-lg transition-all"
          >
            <Pencil className="w-5 h-5" />
            <span className="font-medium">Compose</span>
          </button>

          {/* Navigation */}
          <nav className="space-y-1">
            <button className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full bg-cmail-purple/20 text-cmail-purple font-medium">
              <InboxIcon className="w-5 h-5" />
              <span>Inbox</span>
              {emails.length > 0 && (
                <span className="ml-auto text-sm">{emails.length}</span>
              )}
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
            {/* Less/More Toggle */}
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              {showMoreMenu ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <span>{showMoreMenu ? 'Less' : 'More'}</span>
            </button>

            {/* Expandable Menu Items */}
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
                  <span className="ml-auto text-sm text-dark-text-secondary">70</span>
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

          {/* Labels Section */}
          <div className="mt-6 px-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-dark-text">Labels</h3>
              <button className="p-1 hover:bg-dark-card rounded transition-colors">
                <Plus className="w-4 h-4 text-dark-text-secondary" />
              </button>
            </div>
          </div>

          {/* Storage Info */}
          <div className="mt-8 px-4">
            <div className="text-xs text-dark-text-secondary mb-2">
              Storage used: 0.1 GB of 15 GB
            </div>
            <div className="w-full bg-dark-border rounded-full h-1 mb-1">
              <div className="bg-cmail-purple h-1 rounded-full" style={{ width: '1%' }}></div>
            </div>
            <div className="text-[10px] text-dark-text-secondary/60 italic mb-3">
              Storage info refreshes daily
            </div>
            <div className="text-[10px] text-cmail-purple/80 italic">
              I'll update the UI real soon
            </div>
          </div>

          {/* Developer Link */}
          <div className="mt-4 px-4 pb-4">
            <button 
              onClick={() => navigate('/developer')}
              className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-dark-card text-dark-text-secondary hover:text-cmail-purple transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Developer</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-dark-border bg-dark-card"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedEmails(emails.map(email => email.id))
                  } else {
                    setSelectedEmails([])
                  }
                }}
              />
              <button 
                onClick={fetchEmails}
                className="p-2 hover:bg-dark-card rounded-full transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-dark-text-secondary" />
              </button>
              <div className="relative more-options-menu">
                <button 
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="p-2 hover:bg-dark-card rounded-full transition-colors"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4 text-dark-text-secondary" />
                </button>
                {showMoreOptions && (
                  <div className="absolute top-full left-0 mt-2 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 min-w-[220px]">
                    {selectedEmails.length > 0 ? (
                      <>
                        <button
                          onClick={handleMarkAllAsRead}
                          className="w-full px-4 py-2 text-left text-dark-text hover:bg-dark-bg transition-colors flex items-center gap-3"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Mark as read</span>
                        </button>
                        <button
                          onClick={handleMarkAsImportant}
                          className="w-full px-4 py-2 text-left text-dark-text hover:bg-dark-bg transition-colors flex items-center gap-3"
                        >
                          <Tag className="w-4 h-4" />
                          <span>Mark as important</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowMoreOptions(false)
                            // Add to tasks functionality
                          }}
                          className="w-full px-4 py-2 text-left text-dark-text hover:bg-dark-bg transition-colors flex items-center gap-3"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Add to Tasks</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowMoreOptions(false)
                            // Label as functionality
                          }}
                          className="w-full px-4 py-2 text-left text-dark-text hover:bg-dark-bg transition-colors flex items-center gap-3 justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Tag className="w-4 h-4" />
                            <span>Label as</span>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowMoreOptions(false)
                            // Mute functionality
                          }}
                          className="w-full px-4 py-2 text-left text-dark-text hover:bg-dark-bg transition-colors flex items-center gap-3"
                        >
                          <AlertOctagon className="w-4 h-4" />
                          <span>Mute</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedEmails(emails.map(e => e._id))
                            setShowMoreOptions(false)
                          }}
                          className="w-full px-4 py-2 text-left text-dark-text hover:bg-dark-bg transition-colors flex items-center gap-3"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Mark all as read</span>
                        </button>
                        <div className="px-4 py-3 text-sm text-dark-text-secondary italic">
                          Select messages to see more actions
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedEmails.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dark-text mr-2">{selectedEmails.length} selected</span>
                <button 
                  onClick={handleArchive}
                  className="p-2 hover:bg-dark-card rounded-full transition-colors"
                  title="Archive"
                >
                  <Archive className="w-4 h-4 text-dark-text-secondary" />
                </button>
                <button 
                  onClick={handleSnooze}
                  className="p-2 hover:bg-dark-card rounded-full transition-colors"
                  title="Snooze"
                >
                  <Clock className="w-4 h-4 text-dark-text-secondary" />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-2 hover:bg-dark-card rounded-full transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-dark-text-secondary" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-dark-text-secondary">
              <span>1-{emails.length} of {emails.length}</span>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-dark-card rounded transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-dark-card rounded transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Email Categories */}
          <div className="flex border-b border-dark-border">
            <button 
              onClick={() => setActiveCategory('primary')}
              className={`px-6 py-3 border-b-2 ${activeCategory === 'primary' ? 'border-cmail-purple text-cmail-purple' : 'border-transparent text-dark-text-secondary hover:bg-dark-card'} font-medium transition-colors`}
            >
              Primary
            </button>
            <button 
              onClick={() => setActiveCategory('social')}
              className={`px-6 py-3 border-b-2 ${activeCategory === 'social' ? 'border-cmail-purple text-cmail-purple' : 'border-transparent text-dark-text-secondary hover:bg-dark-card'} transition-colors`}
            >
              Social
            </button>
            <button 
              onClick={() => setActiveCategory('promotions')}
              className={`px-6 py-3 border-b-2 ${activeCategory === 'promotions' ? 'border-cmail-purple text-cmail-purple' : 'border-transparent text-dark-text-secondary hover:bg-dark-card'} transition-colors`}
            >
              Promotions
            </button>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <ProfileLoader size="md" />
              </div>
            ) : emails.length > 0 ? (
              emails.map((email) => (
                <div
                  key={email._id}
                  className={`flex items-center px-4 py-3 border-b border-dark-border hover:shadow-md transition-all cursor-pointer ${
                    !email.isRead ? 'bg-dark-card/50' : ''
                  } ${selectedEmails.includes(email._id) ? 'bg-dark-card' : ''}`}
                  onClick={() => navigate(`/email/${email._id}`)}
                >
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email._id)}
                    onChange={() => toggleEmailSelection(email._id)}
                    className="w-4 h-4 rounded border-dark-border mr-3"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="mr-3"
                    onClick={(e) => toggleStar(email._id, e)}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-dark-text-secondary'
                      }`}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className={`text-sm mr-4 ${!email.isRead ? 'font-semibold text-dark-text' : 'text-dark-text'}`}>
                        {email.from?.firstName} {email.from?.lastName}
                      </span>
                      <span className={`text-sm flex-1 truncate ${!email.isRead ? 'font-semibold text-dark-text' : 'text-dark-text-secondary'}`}>
                        {email.subject}
                      </span>
                      <span className="text-xs text-dark-text-secondary ml-4 whitespace-nowrap">
                        {formatTime(email.createdAt)}
                      </span>
                    </div>
                    <div className="text-sm text-dark-text-secondary truncate mt-1">
                      {email.body.substring(0, 100)}...
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-dark-text-secondary">
                <InboxIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">No messages in {activeCategory}</p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Compose Email Modal */}
      <ComposeEmail 
        isOpen={showCompose} 
        onClose={() => setShowCompose(false)}
        onSent={fetchEmails}
      />

      {/* Create Label Modal */}
      <CreateLabelModal
        isOpen={showCreateLabel}
        onClose={() => setShowCreateLabel(false)}
        onLabelCreated={(labelName) => {
          console.log('Label created:', labelName)
          // You can add API call here to save the label
        }}
      />

      {/* Mobile Navigation */}
      <MobileNav 
        onCompose={() => setShowCompose(true)}
        onMenuOpen={() => setShowMobileMenu(true)}
      />
    </div>
  )
}

export default Inbox

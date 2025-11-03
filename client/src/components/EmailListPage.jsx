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
import CmailLogo from './CmailLogo'
import ComposeEmail from './ComposeEmail'
import CreateLabelModal from './CreateLabelModal'
import ConfirmModal from './ConfirmModal'
import Loader from './Loader'
import ProfileLoader from './ProfileLoader'

const EmailListPage = ({ 
  title, 
  icon: Icon, 
  fetchUrl, 
  emptyMessage = 'No emails found',
  emptyIcon: EmptyIcon = Mail
}) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showCreateLabel, setShowCreateLabel] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [selectedEmails, setSelectedEmails] = useState([])
  const [showEmptyTrashConfirm, setShowEmptyTrashConfirm] = useState(false)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(fetchUrl)
      setEmails(response.data.emails || response.data.drafts || [])
    } catch (error) {
      console.error('Error fetching emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailClick = (emailId) => {
    navigate(`/email/${emailId}`)
  }

  const handleStarToggle = async (emailId, e) => {
    e.stopPropagation()
    try {
      await axios.patch(`/api/emails/${emailId}/star`)
      fetchEmails()
    } catch (error) {
      console.error('Error toggling star:', error)
    }
  }

  const handleEmptyTrash = async () => {
    try {
      // Delete all emails in trash
      await Promise.all(
        emails.map(email => axios.delete(`/api/emails/${email._id}?permanent=true`))
      )
      fetchEmails()
      setShowMoreOptions(false)
    } catch (error) {
      console.error('Error emptying trash:', error)
      alert('Failed to empty trash')
    }
  }

  const formatDate = (date) => {
    const emailDate = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (emailDate.toDateString() === today.toDateString()) {
      return emailDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    } else if (emailDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else if (emailDate.getFullYear() === today.getFullYear()) {
      return emailDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      return emailDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  }

  const filteredEmails = emails.filter(email =>
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-dark-card rounded-full transition-colors"
          >
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} border-r border-dark-border flex flex-col transition-all duration-300 bg-dark-bg`}>
          <div className="p-4">
            <button
              onClick={() => setShowCompose(true)}
              className={`${sidebarCollapsed ? 'w-12 h-12 p-0 justify-center' : 'w-full px-6 py-3'} bg-cmail-purple hover:bg-cmail-purple-dark text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-3`}
            >
              <Pencil className="w-5 h-5" />
              {!sidebarCollapsed && <span>Compose</span>}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <button
              onClick={() => navigate('/inbox')}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <InboxIcon className="w-5 h-5 text-dark-text" />
              {!sidebarCollapsed && <span className="text-dark-text font-medium">Inbox</span>}
            </button>

            <button
              onClick={() => navigate('/starred')}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Star className="w-5 h-5 text-dark-text" />
              {!sidebarCollapsed && <span className="text-dark-text">Starred</span>}
            </button>

            <button
              onClick={() => navigate('/snoozed')}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Clock className="w-5 h-5 text-dark-text" />
              {!sidebarCollapsed && <span className="text-dark-text">Snoozed</span>}
            </button>

            <button
              onClick={() => navigate('/sent')}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Send className="w-5 h-5 text-dark-text" />
              {!sidebarCollapsed && <span className="text-dark-text">Sent</span>}
            </button>

            <button
              onClick={() => navigate('/drafts')}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <File className="w-5 h-5 text-dark-text" />
              {!sidebarCollapsed && <span className="text-dark-text">Drafts</span>}
            </button>

            {!sidebarCollapsed && (
              <>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors"
                >
                  {showMore ? <ChevronUp className="w-5 h-5 text-dark-text" /> : <ChevronDown className="w-5 h-5 text-dark-text" />}
                  <span className="text-dark-text">{showMore ? 'Less' : 'More'}</span>
                </button>

                {showMore && (
                  <>
                    <button
                      onClick={() => navigate('/important')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors"
                    >
                      <Tag className="w-5 h-5 text-dark-text" />
                      <span className="text-dark-text">Important</span>
                    </button>

                    <button
                      onClick={() => navigate('/scheduled')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-dark-text" />
                      <span className="text-dark-text">Scheduled</span>
                    </button>

                    <button
                      onClick={() => navigate('/all')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors"
                    >
                      <Mail className="w-5 h-5 text-dark-text" />
                      <span className="text-dark-text">All Mail</span>
                    </button>

                    <button
                      onClick={() => navigate('/spam')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors"
                    >
                      <AlertOctagon className="w-5 h-5 text-dark-text" />
                      <span className="text-dark-text">Spam</span>
                    </button>

                    <button
                      onClick={() => navigate('/trash')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-dark-text" />
                      <span className="text-dark-text">Trash</span>
                    </button>
                  </>
                )}

                <div className="border-t border-dark-border my-2"></div>

                <button
                  onClick={() => navigate('/subscriptions')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-dark-text-secondary" />
                  <span className="text-dark-text-secondary">Manage subscriptions</span>
                </button>

                <button
                  onClick={() => navigate('/labels')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-sm"
                >
                  <Tags className="w-4 h-4 text-dark-text-secondary" />
                  <span className="text-dark-text-secondary">Manage labels</span>
                </button>

                <button
                  onClick={() => setShowCreateLabel(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 text-dark-text-secondary" />
                  <span className="text-dark-text-secondary">Create new label</span>
                </button>

                <div className="border-t border-dark-border my-2"></div>

                <div className="px-4 py-2">
                  <div className="text-xs text-dark-text-secondary mb-1">Storage</div>
                  <div className="w-full bg-dark-card rounded-full h-2 mb-1">
                    <div className="bg-cmail-purple h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <div className="text-xs text-dark-text-secondary mb-1">2.25 GB of 15 GB used</div>
                  <div className="text-[10px] text-dark-text-secondary/60 italic">
                    Storage info refreshes daily
                  </div>
                </div>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
            <div className="flex items-center gap-4">
              <Icon className="w-5 h-5 text-dark-text" />
              <h1 className="text-xl font-normal text-dark-text">{title}</h1>
              <span className="text-sm text-dark-text-secondary">({filteredEmails.length})</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={fetchEmails}
                className="p-2 hover:bg-dark-card rounded-full transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-dark-text-secondary" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="p-2 hover:bg-dark-card rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-dark-text-secondary" />
                </button>
                {showMoreOptions && title === 'Trash' && (
                  <div className="absolute right-0 top-full mt-2 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 min-w-[200px]">
                    <button
                      onClick={() => {
                        setShowEmptyTrashConfirm(true)
                        setShowMoreOptions(false)
                      }}
                      disabled={emails.length === 0}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-dark-bg transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Empty Trash</span>
                    </button>
                    <div className="px-4 py-2 text-xs text-dark-text-secondary">
                      All emails in trash will be permanently deleted
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <ProfileLoader size="md" />
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-dark-text-secondary">
                <EmptyIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">{emptyMessage}</p>
              </div>
            ) : (
              <div className="divide-y divide-dark-border">
                {filteredEmails.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => handleEmailClick(email._id)}
                    className={`flex items-center gap-4 px-4 py-3 hover:shadow-md cursor-pointer transition-all ${
                      email.isRead ? 'bg-dark-bg' : 'bg-dark-card'
                    }`}
                  >
                    <button
                      onClick={(e) => handleStarToggle(email._id, e)}
                      className="flex-shrink-0"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-dark-text-secondary'
                        }`}
                      />
                    </button>

                    <div className="flex-shrink-0 w-48 truncate">
                      <span className={`${email.isRead ? 'font-normal' : 'font-semibold'} text-dark-text`}>
                        {email.from?.firstName} {email.from?.lastName}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`${email.isRead ? 'font-normal' : 'font-semibold'} text-dark-text truncate`}>
                          {email.subject}
                        </span>
                        <span className="text-dark-text-secondary text-sm truncate">
                          - {email.body?.substring(0, 100)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-sm text-dark-text-secondary">
                      {formatDate(email.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Compose Modal */}
      <ComposeEmail 
        isOpen={showCompose} 
        onClose={() => setShowCompose(false)}
        onSent={() => {
          setShowCompose(false)
          fetchEmails()
        }}
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

      {/* Empty Trash Confirmation Modal */}
      <ConfirmModal
        isOpen={showEmptyTrashConfirm}
        onClose={() => setShowEmptyTrashConfirm(false)}
        onConfirm={handleEmptyTrash}
        title="Empty Trash"
        message={`Permanently delete all ${emails.length} email(s) in Trash? This action cannot be undone.`}
        confirmText="Delete Forever"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default EmailListPage

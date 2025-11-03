import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Star, Archive, Trash2, MoreVertical, 
  Reply, Forward, Printer, Download, ChevronLeft, ChevronRight, AlertCircle,
  Menu, Pencil, Inbox as InboxIcon, Clock, Send, File, ShoppingBag,
  ChevronDown, ChevronUp, Plus, Mail, AlertOctagon, Calendar, Tag, Tags, Settings
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import ComposeEmail from '../components/ComposeEmail'
import CreateLabelModal from '../components/CreateLabelModal'
import Loader from '../components/Loader'
import ProfileLoader from '../components/ProfileLoader'

const EmailView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReply, setShowReply] = useState(false)
  const [showForward, setShowForward] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showCreateLabel, setShowCreateLabel] = useState(false)

  useEffect(() => {
    fetchEmail()
  }, [id])

  const fetchEmail = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/emails/${id}`)
      setEmail(response.data.email)
    } catch (error) {
      console.error('Failed to fetch email:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStar = async () => {
    try {
      await axios.patch(`/api/emails/${id}/star`)
      setEmail({ ...email, isStarred: !email.isStarred })
    } catch (error) {
      console.error('Failed to toggle star:', error)
    }
  }

  const deleteEmail = async () => {
    try {
      await axios.delete(`/api/emails/${id}`)
      navigate('/inbox')
    } catch (error) {
      console.error('Failed to delete email:', error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <ProfileLoader size="md" />
      </div>
    )
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-dark-text-secondary">Email not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left Sidebar - Full Gmail Style */}
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
          <div className="w-full bg-dark-border rounded-full h-1">
            <div className="bg-cmail-purple h-1 rounded-full" style={{ width: '1%' }}></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-dark-border">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/inbox')}
              className="p-2 hover:bg-dark-card rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-dark-text-secondary" />
            </button>
            <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
              <Archive className="w-5 h-5 text-dark-text-secondary" />
            </button>
            <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
              <AlertCircle className="w-5 h-5 text-dark-text-secondary" />
            </button>
            <button
              onClick={deleteEmail}
              className="p-2 hover:bg-dark-card rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5 text-dark-text-secondary" />
            </button>
            <div className="w-px h-6 bg-dark-border mx-2"></div>
            <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-dark-text-secondary" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-dark-text-secondary">1 of 1</span>
            <div className="flex space-x-1">
              <button className="p-1 hover:bg-dark-card rounded transition-colors">
                <ChevronLeft className="w-5 h-5 text-dark-text-secondary" />
              </button>
              <button className="p-1 hover:bg-dark-card rounded transition-colors">
                <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
              </button>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-6">
            {/* Subject */}
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-2xl font-normal text-dark-text flex-1">
                {email.subject}
              </h1>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
                  <Printer className="w-5 h-5 text-dark-text-secondary" />
                </button>
                <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
                  <Download className="w-5 h-5 text-dark-text-secondary" />
                </button>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-dark-card rounded-lg border border-dark-border">
              {/* Sender Info */}
              <div className="px-6 py-4 flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-cmail-purple flex items-center justify-center text-white font-medium">
                    {email.from?.firstName?.[0]}{email.from?.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-dark-text font-medium">
                        {email.from?.firstName} {email.from?.lastName}
                      </span>
                      <span className="text-sm text-dark-text-secondary">
                        &lt;{email.from?.email}&gt;
                      </span>
                    </div>
                    <div className="text-sm text-dark-text-secondary mt-1">
                      to me
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-dark-text-secondary">
                    {formatDate(email.createdAt)}
                  </span>
                  <button
                    onClick={toggleStar}
                    className="p-1 hover:bg-dark-bg rounded transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-dark-text-secondary'
                      }`}
                    />
                  </button>
                  <button className="p-1 hover:bg-dark-bg rounded transition-colors">
                    <MoreVertical className="w-5 h-5 text-dark-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Email Body */}
              <div className="px-6 py-4 text-dark-text whitespace-pre-wrap leading-relaxed">
                {email.body}
              </div>

              {/* Reply/Forward Buttons */}
              <div className="px-6 py-4 border-t border-dark-border flex items-center space-x-2">
                <button
                  onClick={() => setShowReply(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-dark-border hover:bg-dark-bg text-dark-text rounded-full transition-colors text-sm"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <button
                  onClick={() => setShowForward(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-dark-border hover:bg-dark-bg text-dark-text rounded-full transition-colors text-sm"
                >
                  <Forward className="w-4 h-4" />
                  <span>Forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReply && (
        <ComposeEmail
          isOpen={showReply}
          onClose={() => setShowReply(false)}
          onSent={() => {
            setShowReply(false)
            navigate('/inbox')
          }}
          replyTo={{
            to: email.from?.email,
            subject: `Re: ${email.subject}`,
            body: `\n\n---\nOn ${formatDate(email.createdAt)}, ${email.from?.firstName} ${email.from?.lastName} wrote:\n${email.body}`
          }}
        />
      )}

      {/* Forward Modal */}
      {showForward && (
        <ComposeEmail
          isOpen={showForward}
          onClose={() => setShowForward(false)}
          onSent={() => {
            setShowForward(false)
            navigate('/inbox')
          }}
          replyTo={{
            subject: `Fwd: ${email.subject}`,
            body: `\n\n---\nForwarded message from ${email.from?.firstName} ${email.from?.lastName}:\n\n${email.body}`
          }}
        />
      )}

      {/* Compose Modal */}
      <ComposeEmail 
        isOpen={showCompose} 
        onClose={() => setShowCompose(false)}
        onSent={() => {
          setShowCompose(false)
          navigate('/inbox')
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
    </div>
  )
}

export default EmailView

import { X, Mail, Star, Send, Clock, Archive, Trash2, AlertOctagon, Tag, Settings, LogOut, Inbox } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CmailLogo from './CmailLogo'

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { icon: Inbox, label: 'Inbox', path: '/inbox', badge: null },
    { icon: Star, label: 'Starred', path: '/starred' },
    { icon: Send, label: 'Sent', path: '/sent' },
    { icon: Clock, label: 'Scheduled', path: '/scheduled' },
    { icon: Mail, label: 'Drafts', path: '/drafts' },
    { icon: Archive, label: 'Archive', path: '/archive' },
    { icon: AlertOctagon, label: 'Spam', path: '/spam' },
    { icon: Trash2, label: 'Trash', path: '/trash' },
    { icon: Tag, label: 'Labels', path: '/labels' },
  ]

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/signin')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-dark-card z-50 md:hidden overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <CmailLogo size="sm" />
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-text" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-cmail-purple flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div className="font-semibold text-dark-text">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm text-dark-text-secondary">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors text-dark-text"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-cmail-purple text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-dark-border bg-dark-card">
          <button
            onClick={() => handleNavigate('/settings')}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors text-dark-text"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default MobileMenu

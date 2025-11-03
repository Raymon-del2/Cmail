import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Star, Send, Archive, Menu, Plus } from 'lucide-react'

const MobileNav = ({ onCompose, onMenuOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: Mail, label: 'Inbox', path: '/inbox' },
    { icon: Star, label: 'Starred', path: '/starred' },
    { icon: Send, label: 'Sent', path: '/sent' },
    { icon: Archive, label: 'Archive', path: '/archive' },
    { icon: Menu, label: 'More', action: onMenuOpen }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = item.path && isActive(item.path)
          
          return (
            <button
              key={index}
              onClick={() => item.path ? navigate(item.path) : item.action?.()}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[60px] ${
                active 
                  ? 'text-cmail-purple bg-cmail-purple/10' 
                  : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-hover'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Floating compose button */}
      <button
        onClick={onCompose}
        className="absolute -top-6 right-4 w-14 h-14 bg-cmail-purple hover:bg-cmail-purple-dark text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}

export default MobileNav

import { Menu, Search, Bell } from 'lucide-react'
import CmailLogo from './CmailLogo'
import ProfileMenu from './ProfileMenu'
import { useState } from 'react'

const MobileHeader = ({ onMenuOpen, title }) => {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="md:hidden sticky top-0 bg-dark-card border-b border-dark-border z-40 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu button */}
        <button
          onClick={onMenuOpen}
          className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-dark-text" />
        </button>

        {/* Center: Logo or Title */}
        <div className="flex items-center">
          {title ? (
            <h1 className="text-lg font-semibold text-dark-text">{title}</h1>
          ) : (
            <CmailLogo size="sm" />
          )}
        </div>

        {/* Right: Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-cmail-purple flex items-center justify-center text-white font-semibold text-sm"
          >
            C
          </button>
          
          {showProfile && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowProfile(false)}
              />
              <div className="absolute right-0 top-12 z-50">
                <ProfileMenu />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileHeader

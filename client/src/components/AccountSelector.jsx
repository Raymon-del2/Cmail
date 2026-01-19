import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AccountSelector = () => {
  const { login, logout, user: currentUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [accounts, setAccounts] = useState([])

  // Load saved accounts from localStorage
  useEffect(() => {
    const savedAccounts = localStorage.getItem('devAccounts')
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    }
  }, [])

  // Add current account to list if not already there
  useEffect(() => {
    if (currentUser) {
      setAccounts(prev => {
        const exists = prev.find(acc => acc.email === currentUser.email)
        if (!exists) {
          const newAccount = {
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            avatar: `${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`.toUpperCase()
          }
          const updated = [...prev, newAccount]
          localStorage.setItem('devAccounts', JSON.stringify(updated))
          return updated
        }
        return prev
      })
    }
  }, [currentUser])

  const switchAccount = (account) => {
    // For switching accounts, we need to have the token stored
    // This is a simplified version - in production you'd need proper multi-account handling
    const accountTokens = JSON.parse(localStorage.getItem('devAccountTokens') || '{}')
    const token = accountTokens[account.email]
    
    if (token) {
      login(token, account)
      setIsOpen(false)
    } else {
      alert(`No saved token for ${account.email}. Please sign in again.`)
    }
  }

  const addAccount = () => {
    const email = prompt('Enter account email:')
    if (email) {
      const password = prompt('Enter account password:')
      if (password) {
        // This would normally call the signin API
        alert('In development mode, please sign in through the normal login flow first.')
      }
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-cmail-purple hover:bg-cmail-purple-dark text-white rounded-full shadow-lg transition-colors text-sm font-medium"
        style={{ display: process.env.NODE_ENV === 'development' ? 'block' : 'none' }}
      >
        Switch Account
      </button>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96">
        <div className="bg-dark-card rounded-xl border border-dark-border shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
            <h2 className="text-lg font-medium text-dark-text">Choose an account</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-dark-bg rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-dark-text-secondary" />
            </button>
          </div>

          {/* Account List */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-dark-text-secondary">
                No accounts saved yet
              </div>
            ) : (
              <div className="space-y-2">
                {accounts.map((account, index) => (
                  <div
                    key={index}
                    onClick={() => switchAccount(account)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      currentUser?.email === account.email
                        ? 'bg-cmail-purple/20 border border-cmail-purple/50'
                        : 'hover:bg-dark-bg border border-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-cmail-purple flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {account.avatar || account.email?.[0]?.toUpperCase()}
                    </div>

                    {/* Account Info */}
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-medium text-dark-text truncate">
                        {account.firstName && account.lastName
                          ? `${account.firstName} ${account.lastName}`
                          : account.email}
                      </div>
                      <div className="text-xs text-dark-text-secondary truncate">
                        {account.email}
                      </div>
                    </div>

                    {/* Current indicator */}
                    {currentUser?.email === account.email && (
                      <div className="ml-2">
                        <div className="w-2 h-2 bg-cmail-purple rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Account Button */}
          <div className="px-4 py-4 border-t border-dark-border">
            <button
              onClick={addAccount}
              className="flex items-center justify-center w-full px-4 py-2 text-cmail-purple hover:text-cmail-purple-dark font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add another account
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountSelector

import { AlertTriangle } from 'lucide-react'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white'
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white'
      default:
        return 'bg-cmail-purple hover:bg-cmail-purple-dark text-white'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-dark-card rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-dark-border">
          <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
            <AlertTriangle className={`w-6 h-6 ${type === 'danger' ? 'text-red-400' : 'text-yellow-400'}`} />
          </div>
          <h2 className="text-xl font-medium text-dark-text">{title}</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-dark-text-secondary">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-dark-border">
          <button
            onClick={onClose}
            className="flex-1 border border-dark-border text-dark-text px-6 py-3 rounded-full font-medium hover:bg-dark-bg transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl ${getButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

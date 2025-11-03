import { useState } from 'react'
import { X, Tag } from 'lucide-react'
import axios from 'axios'

const CreateLabelModal = ({ isOpen, onClose, onLabelCreated }) => {
  const [labelName, setLabelName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!labelName.trim()) {
      setError('Please enter a label name')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Save label to backend
      const response = await axios.post('/api/labels', {
        name: labelName.trim()
      })

      if (response.data.success) {
        // Call callback with the created label
        if (onLabelCreated) {
          onLabelCreated(response.data.label)
        }
        
        setLabelName('')
        onClose()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create label')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setLabelName('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div 
        className="bg-dark-card rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <h2 className="text-xl font-medium text-dark-text">Create New Label</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-dark-bg rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-dark-text font-medium mb-2">
              Label name
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
              <input
                type="text"
                value={labelName}
                onChange={(e) => {
                  setLabelName(e.target.value)
                  setError('')
                }}
                placeholder="Enter label name"
                className="w-full pl-12 pr-4 py-3 bg-dark-bg border border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-cmail-purple focus:border-cmail-purple transition-all placeholder-dark-text-secondary"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
            <h3 className="text-dark-text font-medium mb-2 text-sm">Label preview</h3>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-cmail-purple" />
              <span className="text-dark-text">
                {labelName || 'Your label name'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cmail-purple text-white px-6 py-3 rounded-full font-medium hover:bg-cmail-purple-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-dark-border text-dark-text px-6 py-3 rounded-full font-medium hover:bg-dark-bg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="px-6 pb-6 text-dark-text-secondary text-xs">
          <p className="mb-1">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use descriptive names</li>
            <li>Keep names short and clear</li>
            <li>You can apply multiple labels to emails</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreateLabelModal

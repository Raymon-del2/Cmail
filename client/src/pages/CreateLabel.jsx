import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowLeft, Tag } from 'lucide-react'

const CreateLabel = () => {
  const navigate = useNavigate()
  const [labelName, setLabelName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!labelName.trim()) {
      setError('Please enter a label name')
      return
    }

    // In a real implementation, you would save this to the backend
    // For now, just navigate back to manage labels
    navigate('/labels')
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/labels')}
            className="flex items-center gap-2 text-dark-text-secondary hover:text-dark-text mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Manage Labels</span>
          </button>
          <div className="flex items-center gap-3">
            <Plus className="w-8 h-8 text-cmail-purple" />
            <h1 className="text-3xl font-normal text-dark-text">Create New Label</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
              <h3 className="text-dark-text font-medium mb-2">Label preview</h3>
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
                className="flex-1 bg-cmail-purple text-white px-6 py-3 rounded-full font-medium hover:bg-cmail-purple-dark transition-all shadow-lg hover:shadow-xl"
              >
                Create Label
              </button>
              <button
                type="button"
                onClick={() => navigate('/labels')}
                className="flex-1 border border-dark-border text-dark-text px-6 py-3 rounded-full font-medium hover:bg-dark-card transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-dark-text-secondary text-sm">
          <p className="mb-2">💡 Tips for creating labels:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Use descriptive names that help you organize your emails</li>
            <li>Keep label names short and clear</li>
            <li>You can apply multiple labels to a single email</li>
            <li>Labels can be edited or deleted later</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreateLabel

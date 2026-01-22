import React, { useState } from 'react'

const ProContactModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const recipientEmail = 'playra@cmail.vercel.app'

  const handleSend = () => {
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.location.href = mailtoLink
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-bg border border-dark-border rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-dark-text mb-4">Contact for Pro</h2>
        
        <div className="mb-4">
          <label className="block text-sm text-dark-text-secondary mb-2">
            To
          </label>
          <input
            type="email"
            value={recipientEmail}
            disabled
            className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-md text-dark-text cursor-not-allowed opacity-60"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-dark-text-secondary mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="CMail Pro Inquiry"
            className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-cmail-purple"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-dark-text-secondary mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="I'm interested in CMail Pro..."
            rows={5}
            className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-cmail-purple resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-dark-surface border border-dark-border text-dark-text rounded-md hover:bg-dark-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!subject || !message}
            className="flex-1 px-4 py-2 bg-cmail-purple text-white rounded-md hover:bg-cmail-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProContactModal

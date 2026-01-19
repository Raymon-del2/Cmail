import { useState, useRef } from 'react'
import { X, Minimize2, Maximize2, Paperclip, Send, AlertCircle, FileText, Image, File, Trash2 } from 'lucide-react'
import axios from 'axios'
import Loader from './Loader'

const ComposeEmail = ({ isOpen, onClose, onSent, replyTo }) => {
  const domain = '@cmail.vercel.app'
  const [formData, setFormData] = useState({
    to: replyTo?.to || '',
    cc: '',
    bcc: '',
    subject: replyTo?.subject || '',
    body: replyTo?.body || ''
  })
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Prevent @ symbol in recipient fields (to, cc, bcc)
    if (['to', 'cc', 'bcc'].includes(name) && value.includes('@')) {
      setError('Please enter username only (without @). Domain will be added automatically.')
      return
    }
    
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleSend = async () => {
    if (!formData.to) {
      setError('Please enter a recipient')
      return
    }

    if (!formData.subject) {
      setError('Please enter a subject')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Add domain to recipients if not already included
      const addDomain = (emails) => {
        return emails.split(',').map(email => {
          const trimmed = email.trim()
          return trimmed.includes('@') ? trimmed : trimmed + domain
        })
      }

      await axios.post('/api/emails/send', {
        to: addDomain(formData.to),
        cc: formData.cc ? addDomain(formData.cc) : [],
        bcc: formData.bcc ? addDomain(formData.bcc) : [],
        subject: formData.subject,
        body: formData.body,
        attachments: attachments
      })

      setSuccess(true)
      setTimeout(() => {
        onSent?.()
        onClose()
        setFormData({ to: '', cc: '', bcc: '', subject: '', body: '' })
        setAttachments([])
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      await axios.post('/api/emails/draft', {
        ...formData,
        attachments: attachments.map(att => att.id)
      })
      onClose()
      setFormData({ to: '', cc: '', bcc: '', subject: '', body: '' })
      setAttachments([])
    } catch (err) {
      console.error('Failed to save draft:', err)
    }
  }

  const handleAttachFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    setError('')

    try {
      for (const file of files) {
        // Validate file size (max 25MB)
        if (file.size > 25 * 1024 * 1024) {
          setError(`File "${file.name}" is too large. Maximum size is 25MB.`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post('/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.data.success) {
          const newAttachment = {
            id: response.data.file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: response.data.file.url
          }
          setAttachments(prev => [...prev, newAttachment])
        }
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || 'Failed to upload file')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText
    return File
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Compose Window */}
      <div 
        className={`relative bg-dark-card rounded-t-2xl shadow-2xl border border-dark-border transition-all ${
          isMinimized ? 'w-80 h-14' : 'w-[600px] h-[600px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-bg rounded-t-2xl">
          <h3 className="text-dark-text font-medium">
            {success ? '✓ Email sent!' : 'New Message'}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-dark-card rounded transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-dark-text-secondary" />
              ) : (
                <Minimize2 className="w-4 h-4 text-dark-text-secondary" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-dark-card rounded transition-colors"
            >
              <X className="w-4 h-4 text-dark-text-secondary" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Form */}
            <div className="flex flex-col h-[calc(100%-120px)]">
              {error && (
                <div className="mx-4 mt-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <div className="px-4 py-2 border-b border-dark-border">
                <div className="flex items-center gap-2">
                  <span className="text-dark-text-secondary text-sm">To:</span>
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="text"
                      name="to"
                      placeholder="username"
                      value={formData.to}
                      onChange={handleChange}
                      className="flex-1 bg-transparent text-dark-text placeholder-dark-text-secondary focus:outline-none"
                    />
                    <span className="text-dark-text-secondary text-sm">{domain}</span>
                  </div>
                </div>
                <p className="text-xs text-dark-text-secondary mt-1 ml-8">Separate multiple recipients with commas</p>
              </div>

              {showCc && (
                <div className="px-4 py-2 border-b border-dark-border">
                  <input
                    type="text"
                    name="cc"
                    placeholder="Cc"
                    value={formData.cc}
                    onChange={handleChange}
                    className="w-full bg-transparent text-dark-text placeholder-dark-text-secondary focus:outline-none"
                  />
                </div>
              )}

              {showBcc && (
                <div className="px-4 py-2 border-b border-dark-border">
                  <input
                    type="text"
                    name="bcc"
                    placeholder="Bcc"
                    value={formData.bcc}
                    onChange={handleChange}
                    className="w-full bg-transparent text-dark-text placeholder-dark-text-secondary focus:outline-none"
                  />
                </div>
              )}

              {!showCc && !showBcc && (
                <div className="px-4 py-1 flex space-x-4 text-xs">
                  <button
                    onClick={() => setShowCc(true)}
                    className="text-dark-text-secondary hover:text-cmail-purple"
                  >
                    Cc
                  </button>
                  <button
                    onClick={() => setShowBcc(true)}
                    className="text-dark-text-secondary hover:text-cmail-purple"
                  >
                    Bcc
                  </button>
                </div>
              )}

              <div className="px-4 py-2 border-b border-dark-border">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-transparent text-dark-text placeholder-dark-text-secondary focus:outline-none"
                />
              </div>

              <div className="flex-1 px-4 py-3">
                <textarea
                  name="body"
                  placeholder="Compose email..."
                  value={formData.body}
                  onChange={handleChange}
                  className="w-full h-full bg-transparent text-dark-text placeholder-dark-text-secondary focus:outline-none resize-none"
                />
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="px-4 py-2 border-t border-dark-border">
                  <div className="text-xs text-dark-text-secondary mb-2">
                    Attachments ({attachments.length})
                  </div>
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {attachments.map((attachment) => {
                      const FileIcon = getFileIcon(attachment.type)
                      return (
                        <div key={attachment.id} className="flex items-center justify-between bg-dark-bg rounded-lg p-2">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <FileIcon className="w-4 h-4 text-dark-text-secondary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-dark-text truncate">{attachment.name}</div>
                              <div className="text-xs text-dark-text-secondary">{formatFileSize(attachment.size)}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 hover:bg-dark-card rounded transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3 text-dark-text-secondary hover:text-red-400" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-dark-border">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSend}
                  disabled={loading || success}
                  className="flex items-center space-x-2 px-6 py-2 bg-cmail-purple hover:bg-cmail-purple-dark text-white rounded-full font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" />
                      <span>Sending...</span>
                    </>
                  ) : success ? (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleAttachFile}
                  disabled={uploading}
                  className="p-2 hover:bg-dark-card rounded-full transition-colors disabled:opacity-50"
                >
                  <Paperclip className={`w-5 h-5 text-dark-text-secondary ${uploading ? 'animate-pulse' : ''}`} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*/*"
                />
              </div>

              <button
                onClick={handleSaveDraft}
                className="text-sm text-dark-text-secondary hover:text-cmail-purple"
              >
                Save Draft
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ComposeEmail

import { useState } from 'react'
import { X, Upload, Image, Video, FileText, File as FileIcon } from 'lucide-react'

const UploadFileModal = ({ isOpen, onClose, labelId, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    
    // Validate file sizes (max 50MB each)
    const validFiles = files.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        setError(`${file.name} exceeds 50MB limit`)
        return false
      }
      return true
    })

    setSelectedFiles(validFiles)
    setError('')
  }

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document'
    return 'other'
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8 text-blue-400" />
      case 'video': return <Video className="w-8 h-8 text-purple-400" />
      case 'document': return <FileText className="w-8 h-8 text-green-400" />
      default: return <FileIcon className="w-8 h-8 text-gray-400" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const handleUpload = async () => {
    console.log('Starting upload...')
    console.log('Selected files:', selectedFiles.length)
    console.log('Label ID:', labelId)

    if (selectedFiles.length === 0) {
      setError('Please select files to upload')
      return
    }

    if (!labelId) {
      setError('Label not found')
      return
    }

    setUploading(true)
    setError('')

    try {
      const axios = (await import('axios')).default

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        console.log(`Uploading file ${i + 1}/${selectedFiles.length}:`, file.name)
        
        // Create FormData
        const formData = new FormData()
        formData.append('file', file)

        console.log('Uploading file to backend...')

        // Upload to backend with progress tracking
        const response = await axios.post(`/api/files/label/${labelId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            const overallProgress = Math.round(((i + (percentCompleted / 100)) / selectedFiles.length) * 100)
            setUploadProgress(overallProgress)
          }
        })
        
        console.log('Upload response:', response.data)
      }

      // Success
      console.log('All files uploaded successfully!')
      setSelectedFiles([])
      setUploadProgress(0)
      if (onUploadComplete) onUploadComplete()
      onClose()
    } catch (err) {
      console.error('Upload error:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || err.message || 'Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setSelectedFiles([])
      setError('')
      setUploadProgress(0)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div 
        className="bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-dark-border max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-cmail-purple" />
            <h2 className="text-xl font-medium text-dark-text">Upload Files</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 hover:bg-dark-bg rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* File Input */}
          <div className="mb-6">
            <label className="block w-full">
              <div className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center hover:border-cmail-purple transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-dark-text-secondary mx-auto mb-3" />
                <p className="text-dark-text mb-2">Click to select files or drag and drop</p>
                <p className="text-sm text-dark-text-secondary">Images, Videos, Documents - Max 50MB each</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-dark-text font-medium mb-3">
                Selected Files ({selectedFiles.length})
              </h3>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg border border-dark-border"
                >
                  {getFileIcon(getFileType(file.type))}
                  <div className="flex-1 min-w-0">
                    <p className="text-dark-text font-medium truncate">{file.name}</p>
                    <p className="text-sm text-dark-text-secondary">{formatFileSize(file.size)}</p>
                  </div>
                  {!uploading && (
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      className="p-1 hover:bg-dark-card rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-dark-text-secondary" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-text">Uploading...</span>
                <span className="text-sm text-dark-text-secondary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div 
                  className="bg-cmail-purple h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-dark-border">
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="flex-1 bg-cmail-purple text-white px-6 py-3 rounded-full font-medium hover:bg-cmail-purple-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading... ${uploadProgress}%` : `Upload ${selectedFiles.length} file(s)`}
          </button>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="flex-1 border border-dark-border text-dark-text px-6 py-3 rounded-full font-medium hover:bg-dark-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadFileModal

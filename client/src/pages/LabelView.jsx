import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Menu, Search, Settings, HelpCircle, Grid3x3, User,
  Pencil, Inbox as InboxIcon, Star, Clock, Send, File as FileIcon, Trash2,
  MoreVertical, RefreshCw, ChevronDown, ChevronUp, Plus,
  Mail, AlertOctagon, Calendar, Tag, Tags, ShoppingBag, Upload,
  Image, Video, FileText, Download, X, CheckSquare, Edit3
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'
import ComposeEmail from '../components/ComposeEmail'
import CreateLabelModal from '../components/CreateLabelModal'
import UploadFileModal from '../components/UploadFileModal'
import ConfirmModal from '../components/ConfirmModal'

const LabelView = () => {
  const { label } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showCreateLabel, setShowCreateLabel] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const [labelId, setLabelId] = useState(null)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [fileToRename, setFileToRename] = useState(null)
  const [newFileName, setNewFileName] = useState('')

  useEffect(() => {
    fetchLabelAndFiles()
  }, [label])

  const fetchLabelAndFiles = async () => {
    try {
      setLoading(true)
      // Get user's labels to find the label ID
      const labelsResponse = await axios.get('/api/labels')
      const userLabel = labelsResponse.data.labels.find(l => l.name === label)
      
      if (userLabel) {
        setLabelId(userLabel._id)
        // Fetch files for this label
        const filesResponse = await axios.get(`/api/files/label/${userLabel._id}`)
        setFiles(filesResponse.data.files || [])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteFile = async () => {
    if (!fileToDelete) return
    
    try {
      await axios.delete(`/api/files/${fileToDelete._id}`)
      fetchLabelAndFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file')
    }
  }

  const handleRenameFile = async () => {
    if (!fileToRename || !newFileName.trim()) return
    
    try {
      await axios.patch(`/api/files/${fileToRename._id}/rename`, {
        newName: newFileName.trim()
      })
      setShowRenameModal(false)
      setFileToRename(null)
      setNewFileName('')
      fetchLabelAndFiles()
    } catch (error) {
      console.error('Error renaming file:', error)
      alert('Failed to rename file')
    }
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(f => f._id))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // Filter files by search query
  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />
      case 'video': return <Video className="w-5 h-5" />
      case 'document': return <FileText className="w-5 h-5" />
      default: return <FileIcon className="w-5 h-5" />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Menu className="w-6 h-6 text-dark-text" />
          </button>
          <CmailLogo size="sm" />
          <span className="text-xl font-normal text-dark-text">C-mail</span>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search files"
              className="w-full pl-12 pr-4 py-3 bg-dark-card text-dark-text rounded-full focus:outline-none focus:ring-2 focus:ring-cmail-purple border border-dark-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Settings className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button className="p-2 hover:bg-dark-card rounded-full transition-colors">
            <Grid3x3 className="w-5 h-5 text-dark-text-secondary" />
          </button>
          <button 
            onClick={logout}
            className="p-2 hover:bg-dark-card rounded-full transition-colors"
          >
            <User className="w-5 h-5 text-dark-text-secondary" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-dark-border p-2 overflow-y-auto">
          <button 
            onClick={() => setShowCompose(true)}
            className="flex items-center space-x-3 px-4 py-3 mb-4 bg-cmail-purple hover:bg-cmail-purple-dark text-white rounded-full shadow-lg transition-all"
          >
            <Pencil className="w-5 h-5" />
            <span className="font-medium">Compose</span>
          </button>

          <nav className="space-y-1">
            <button 
              onClick={() => navigate('/inbox')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <InboxIcon className="w-5 h-5" />
              <span>Inbox</span>
            </button>
            <button 
              onClick={() => navigate('/starred')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <Star className="w-5 h-5" />
              <span>Starred</span>
            </button>
            <button 
              onClick={() => navigate('/snoozed')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <Clock className="w-5 h-5" />
              <span>Snoozed</span>
            </button>
            <button 
              onClick={() => navigate('/sent')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Sent</span>
            </button>
            <button 
              onClick={() => navigate('/drafts')}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              <FileIcon className="w-5 h-5" />
              <span>Drafts</span>
            </button>
            
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
            >
              {showMoreMenu ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <span>{showMoreMenu ? 'Less' : 'More'}</span>
            </button>

            {showMoreMenu && (
              <>
                <button 
                  onClick={() => navigate('/important')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Tag className="w-5 h-5" />
                  <span>Important</span>
                </button>
                <button 
                  onClick={() => navigate('/scheduled')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Scheduled</span>
                </button>
                <button 
                  onClick={() => navigate('/all')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>All Mail</span>
                </button>
                <button 
                  onClick={() => navigate('/spam')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <AlertOctagon className="w-5 h-5" />
                  <span>Spam</span>
                </button>
                <button 
                  onClick={() => navigate('/trash')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Trash</span>
                </button>
                <div className="h-px bg-dark-border my-2"></div>
                <button 
                  onClick={() => navigate('/subscriptions')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Manage subscriptions</span>
                </button>
                <button 
                  onClick={() => navigate('/labels')}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Tags className="w-5 h-5" />
                  <span>Manage labels</span>
                </button>
                <button 
                  onClick={() => setShowCreateLabel(true)}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-r-full hover:bg-dark-card text-dark-text transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create new label</span>
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
            <div className="flex items-center gap-4">
              <Tag className="w-5 h-5 text-cmail-purple" />
              <h1 className="text-xl font-normal text-dark-text">{label}</h1>
              <span className="text-sm text-dark-text-secondary">({filteredFiles.length} files)</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-text-secondary" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-cmail-purple w-64"
                />
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-cmail-purple text-white rounded-lg hover:bg-cmail-purple-dark transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </button>
              <button 
                onClick={fetchLabelAndFiles}
                className="p-2 hover:bg-dark-card rounded-full transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-dark-text-secondary" />
              </button>
              
              {/* More Options Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="p-2 hover:bg-dark-card rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-dark-text-secondary" />
                </button>
                {showMoreOptions && (
                  <div className="absolute right-0 top-full mt-2 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 min-w-[200px]">
                    <button
                      onClick={() => {
                        handleSelectAll()
                        setShowMoreOptions(false)
                      }}
                      className="w-full px-4 py-3 text-left text-dark-text hover:bg-dark-bg transition-colors flex items-center gap-3"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>{selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Files Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-dark-text-secondary">Loading files...</div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-dark-text-secondary">
                <Tag className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg mb-4">{searchQuery ? 'No files match your search' : 'No files in this label'}</p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-cmail-purple text-white rounded-full hover:bg-cmail-purple-dark transition-colors"
                  >
                    Upload your first file
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file._id}
                    className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-cmail-purple transition-colors group"
                  >
                    {/* File Preview */}
                    <div className="aspect-video bg-dark-bg flex items-center justify-center relative">
                      {file.type === 'image' ? (
                        <img
                          src={`http://localhost:5000${file.url}`}
                          alt={file.originalName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image load error:', e.target.src)
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : file.type === 'video' ? (
                        <video
                          src={`http://localhost:5000${file.url}`}
                          className="w-full h-full object-cover"
                          controls
                          onError={(e) => {
                            console.error('Video load error:', e.target.src)
                          }}
                        />
                      ) : (
                        <div className="text-cmail-purple">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setFileToRename(file)
                            setNewFileName(file.originalName)
                            setShowRenameModal(true)
                          }}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                          title="Rename"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setFileToDelete(file)
                            setShowDeleteConfirm(true)
                          }}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="p-3">
                      <h3 className="text-dark-text font-medium truncate mb-1">
                        {file.originalName}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-dark-text-secondary">
                        <span>{formatFileSize(file.size)}</span>
                        <a
                          href={`http://localhost:5000${file.url}`}
                          download={file.originalName}
                          className="text-cmail-purple hover:text-cmail-purple-dark"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Compose Modal */}
      <ComposeEmail 
        isOpen={showCompose} 
        onClose={() => setShowCompose(false)}
        onSent={() => setShowCompose(false)}
      />

      {/* Create Label Modal */}
      <CreateLabelModal
        isOpen={showCreateLabel}
        onClose={() => setShowCreateLabel(false)}
        onLabelCreated={(labelName) => {
          console.log('Label created:', labelName)
        }}
      />

      {/* Upload File Modal */}
      <UploadFileModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        labelId={labelId}
        onUploadComplete={fetchLabelAndFiles}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setFileToDelete(null)
        }}
        onConfirm={handleDeleteFile}
        title="Delete File"
        message={`Are you sure you want to delete "${fileToDelete?.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Rename File Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRenameModal(false)}>
          <div 
            className="bg-dark-card rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-dark-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
              <div className="flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-cmail-purple" />
                <h2 className="text-xl font-medium text-dark-text">Rename File</h2>
              </div>
              <button
                onClick={() => setShowRenameModal(false)}
                className="p-2 hover:bg-dark-bg rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-dark-text-secondary" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <label className="block text-sm text-dark-text-secondary mb-2">
                New file name
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
                placeholder="Enter new file name"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleRenameFile()
                }}
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-dark-border">
              <button
                onClick={() => setShowRenameModal(false)}
                className="flex-1 border border-dark-border text-dark-text px-6 py-3 rounded-full font-medium hover:bg-dark-bg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameFile}
                disabled={!newFileName.trim()}
                className="flex-1 bg-cmail-purple text-white px-6 py-3 rounded-full font-medium hover:bg-cmail-purple-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LabelView

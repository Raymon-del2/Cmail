import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, Lock, Bell, Shield, Database, CreditCard, 
  Globe, Eye, Download, Trash2, ArrowLeft, Camera,
  Mail, Phone, MapPin, Calendar, Check, X, Edit2, Save
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CmailLogo from '../components/CmailLogo'
import PhoneVerificationModal from '../components/PhoneVerificationModal'
import axios from 'axios'

const AccountSettings = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [activeSection, setActiveSection] = useState('home')
  const [editMode, setEditMode] = useState({})
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    birthday: user?.birthday || '',
    address: user?.address || ''
  })
  const [saveMessage, setSaveMessage] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [phoneToVerify, setPhoneToVerify] = useState('')
  
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
        address: user.address || ''
      })
    }
  }, [user])
  
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }
    
    try {
      setUploading(true)
      
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const response = await axios.patch('/api/user/profile', {
            profilePicture: reader.result
          })
          
          if (response.data.success) {
            updateUser(response.data.user)
            setSaveMessage('Profile picture updated successfully')
            setTimeout(() => setSaveMessage(''), 3000)
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error)
          alert('Failed to upload profile picture')
        } finally {
          setUploading(false)
        }
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image')
      setUploading(false)
    }
  }
  
  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true })
  }
  
  const handleSave = async (field) => {
    // Special handling for phone number
    if (field === 'phone') {
      if (!formData.phone || formData.phone === user.phone) {
        setEditMode({ ...editMode, [field]: false })
        return
      }
      
      // Send OTP for phone verification
      try {
        const response = await axios.post('/api/phone-verification/send-otp', {
          phone: formData.phone
        })
        
        if (response.data.success) {
          setPhoneToVerify(formData.phone)
          setShowPhoneVerification(true)
          
          // Show dev OTP in console for testing
          if (response.data.devOTP) {
            console.log('🔐 Verification code:', response.data.devOTP)
            alert(`Development Mode: Your verification code is ${response.data.devOTP}`)
          }
        }
      } catch (error) {
        console.error('Error sending OTP:', error)
        alert(error.response?.data?.message || 'Failed to send verification code')
      }
      return
    }
    
    // Regular save for other fields
    try {
      const response = await axios.patch('/api/user/profile', {
        [field]: formData[field]
      })
      
      if (response.data.success) {
        updateUser(response.data.user)
        setEditMode({ ...editMode, [field]: false })
        setSaveMessage('Profile updated successfully')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }
  
  const handlePhoneVerified = (updatedUser) => {
    updateUser(updatedUser)
    setEditMode({ ...editMode, phone: false })
    setSaveMessage('Phone number verified and saved successfully')
    setTimeout(() => setSaveMessage(''), 3000)
  }
  
  const handleCancel = (field) => {
    setFormData({ ...formData, [field]: user[field] || '' })
    setEditMode({ ...editMode, [field]: false })
  }
  
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }
  
  const handlePasswordChange = async () => {
    navigate('/reset-password')
  }
  
  const handleEnable2FA = async () => {
    try {
      const response = await axios.post('/api/user/enable-2fa')
      if (response.data.success) {
        setTwoFactorEnabled(true)
        setSaveMessage('2-Step Verification enabled')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error)
      alert('Failed to enable 2-Step Verification')
    }
  }
  
  const handleDownloadData = async () => {
    try {
      const response = await axios.get('/api/user/export-data', {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `cmail-data-${Date.now()}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      setSaveMessage('Data exported successfully')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error downloading data:', error)
      alert('Failed to download data')
    }
  }
  
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'This will permanently delete all your emails, files, and data. Are you absolutely sure?'
      )
      
      if (doubleConfirm) {
        try {
          await axios.delete('/api/user/account')
          navigate('/signin')
        } catch (error) {
          console.error('Error deleting account:', error)
          alert('Failed to delete account')
        }
      }
    }
  }

  const getInitials = () => {
    if (!user) return 'U'
    const firstInitial = user.firstName?.[0] || ''
    const lastInitial = user.lastName?.[0] || ''
    return (firstInitial + lastInitial).toUpperCase() || 'U'
  }

  const sections = [
    { id: 'home', name: 'Home', icon: User },
    { id: 'personal-info', name: 'Personal info', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'privacy', name: 'Privacy & personalization', icon: Eye },
    { id: 'data', name: 'Data & privacy', icon: Database },
    { id: 'payments', name: 'Payments & subscriptions', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/inbox')}
              className="p-2 hover:bg-dark-bg rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <CmailLogo />
            <h1 className="text-xl font-normal ml-4">Cmail Account</h1>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Check className="w-4 h-4" />
                <span>{saveMessage}</span>
              </div>
            )}
            <span className="text-sm text-dark-text-secondary">{user?.email}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cmail-purple to-purple-600 text-white font-medium flex items-center justify-center">
              {getInitials()}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="col-span-3">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-cmail-purple/20 text-cmail-purple'
                        : 'hover:bg-dark-card text-dark-text'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{section.name}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-9">
            {activeSection === 'home' && (
              <HomeSection 
                user={user} 
                getInitials={getInitials}
                handleProfilePictureUpload={handleProfilePictureUpload}
                uploading={uploading}
              />
            )}
            {activeSection === 'personal-info' && (
              <PersonalInfoSection 
                user={user} 
                formData={formData}
                editMode={editMode}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleCancel={handleCancel}
                handleChange={handleChange}
              />
            )}
            {activeSection === 'security' && (
              <SecuritySection 
                handlePasswordChange={handlePasswordChange}
                handleEnable2FA={handleEnable2FA}
                twoFactorEnabled={twoFactorEnabled}
              />
            )}
            {activeSection === 'privacy' && <PrivacySection />}
            {activeSection === 'data' && (
              <DataSection 
                handleDownloadData={handleDownloadData}
                handleDeleteAccount={handleDeleteAccount}
              />
            )}
            {activeSection === 'payments' && <PaymentsSection />}
          </main>
        </div>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        phone={phoneToVerify}
        onVerified={handlePhoneVerified}
      />
    </div>
  )
}

// Home Section
const HomeSection = ({ user, getInitials, handleProfilePictureUpload, uploading }) => {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-dark-card rounded-2xl p-8 border border-dark-border">
        <div className="flex items-start gap-6">
          <div className="relative">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cmail-purple to-purple-600 text-white text-3xl font-bold flex items-center justify-center">
                {getInitials()}
              </div>
            )}
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="profile-picture-upload"
              className={`absolute bottom-0 right-0 w-8 h-8 bg-dark-bg border-2 border-dark-card rounded-full flex items-center justify-center hover:bg-dark-border transition-colors cursor-pointer ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-cmail-purple border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </label>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-normal mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-dark-text-secondary mb-4">{user?.email}</p>
            <button className="px-6 py-2 border border-dark-border rounded-full hover:bg-dark-bg transition-colors text-sm">
              Manage your Cmail Account
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <QuickActionCard
          icon={Shield}
          title="Security"
          description="Keep your account secure"
          color="blue"
        />
        <QuickActionCard
          icon={Eye}
          title="Privacy"
          description="Control your data"
          color="green"
        />
        <QuickActionCard
          icon={Database}
          title="Storage"
          description="Manage your storage"
          color="purple"
        />
      </div>

    </div>
  )
}

// Personal Info Section
const PersonalInfoSection = ({ user, formData, editMode, handleEdit, handleSave, handleCancel, handleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Personal info</h2>
        <p className="text-dark-text-secondary">
          Info about you and your preferences across Cmail services
        </p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <EditableInfoRow 
          icon={User} 
          label="First Name" 
          value={formData.firstName}
          field="firstName"
          editMode={editMode.firstName}
          onEdit={() => handleEdit('firstName')}
          onSave={() => handleSave('firstName')}
          onCancel={() => handleCancel('firstName')}
          onChange={(value) => handleChange('firstName', value)}
        />
        <EditableInfoRow 
          icon={User} 
          label="Last Name" 
          value={formData.lastName}
          field="lastName"
          editMode={editMode.lastName}
          onEdit={() => handleEdit('lastName')}
          onSave={() => handleSave('lastName')}
          onCancel={() => handleCancel('lastName')}
          onChange={(value) => handleChange('lastName', value)}
        />
        <InfoRow icon={Mail} label="Email" value={user?.email} readOnly />
        <InfoRow icon={Phone} label="Phone" value="Coming soon" readOnly />
        <EditableInfoRow 
          icon={Calendar} 
          label="Birthday" 
          value={formData.birthday || 'Not provided'}
          field="birthday"
          type="date"
          editMode={editMode.birthday}
          onEdit={() => handleEdit('birthday')}
          onSave={() => handleSave('birthday')}
          onCancel={() => handleCancel('birthday')}
          onChange={(value) => handleChange('birthday', value)}
        />
        <EditableInfoRow 
          icon={MapPin} 
          label="Address" 
          value={formData.address || 'Not provided'}
          field="address"
          editMode={editMode.address}
          onEdit={() => handleEdit('address')}
          onSave={() => handleSave('address')}
          onCancel={() => handleCancel('address')}
          onChange={(value) => handleChange('address', value)}
        />
      </div>
    </div>
  )
}

// Security Section
const SecuritySection = ({ handlePasswordChange, handleEnable2FA, twoFactorEnabled }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Security</h2>
        <p className="text-dark-text-secondary">
          Settings and recommendations to help keep your account secure
        </p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <SecurityRow
          icon={Lock}
          title="Password"
          description="Keep your password secure"
          action="Change"
          onClick={handlePasswordChange}
        />
        <SecurityRow
          icon={Shield}
          title="2-Step Verification"
          description={twoFactorEnabled ? 'Enabled' : 'Not enabled'}
          action={twoFactorEnabled ? 'Manage' : 'Enable'}
          onClick={handleEnable2FA}
        />
        <SecurityRow
          icon={Globe}
          title="Recent activity"
          description="Review devices and activity"
          action="Review"
          onClick={() => alert('Recent activity feature coming soon')}
        />
      </div>
    </div>
  )
}

// Privacy Section
const PrivacySection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Privacy & personalization</h2>
        <p className="text-dark-text-secondary">
          Control what data is used to personalize your Cmail experience
        </p>
      </div>

      <div className="space-y-4">
        <PrivacyCard
          title="Activity controls"
          description="Decide what activity is saved to your account"
        />
        <PrivacyCard
          title="Ad personalization"
          description="Control how ads are personalized for you"
        />
        <PrivacyCard
          title="Shared endorsements"
          description="Control what others see about your activity"
        />
      </div>
    </div>
  )
}

// Data Section
const DataSection = ({ handleDownloadData, handleDeleteAccount }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Data & privacy</h2>
        <p className="text-dark-text-secondary">
          Manage your data and privacy settings
        </p>
      </div>

      <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
        <DataRow
          icon={Download}
          title="Download your data"
          description="Export a copy of your Cmail data"
          onClick={handleDownloadData}
        />
        <DataRow
          icon={Trash2}
          title="Delete your account"
          description="Permanently delete your Cmail account"
          onClick={handleDeleteAccount}
          danger
        />
      </div>
    </div>
  )
}

// Payments Section
const PaymentsSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal mb-2">Payments & subscriptions</h2>
        <p className="text-dark-text-secondary">
          Manage your payment methods and subscriptions
        </p>
      </div>

      <div className="bg-dark-card rounded-2xl p-8 border border-dark-border text-center">
        <CreditCard className="w-16 h-16 mx-auto mb-4 text-dark-text-secondary" />
        <h3 className="text-lg font-medium mb-2">No payment methods</h3>
        <p className="text-dark-text-secondary mb-4">
          Add a payment method to make purchases
        </p>
        <button className="px-6 py-2 bg-cmail-purple text-white rounded-full hover:bg-cmail-purple-dark transition-colors">
          Add payment method
        </button>
      </div>
    </div>
  )
}

// Helper Components
const QuickActionCard = ({ icon: Icon, title, description, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border hover:border-cmail-purple transition-colors cursor-pointer">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-dark-text-secondary">{description}</p>
    </div>
  )
}

const InfoRow = ({ icon: Icon, label, value, readOnly }) => {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-dark-bg transition-colors">
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-dark-text-secondary" />
        <div>
          <div className="text-sm text-dark-text-secondary">{label}</div>
          <div className="font-medium">{value}</div>
        </div>
      </div>
      {!readOnly && <div className="w-16"></div>}
    </div>
  )
}

const EditableInfoRow = ({ icon: Icon, label, value, field, type = 'text', editMode, onEdit, onSave, onCancel, onChange }) => {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-dark-bg transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Icon className="w-5 h-5 text-dark-text-secondary" />
        <div className="flex-1">
          <div className="text-sm text-dark-text-secondary mb-1">{label}</div>
          {editMode ? (
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-cmail-purple"
              autoFocus
            />
          ) : (
            <div className="font-medium">{value}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {editMode ? (
          <>
            <button
              onClick={onCancel}
              className="p-2 text-dark-text-secondary hover:text-dark-text rounded-full hover:bg-dark-card transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={onSave}
              className="p-2 text-cmail-purple hover:bg-cmail-purple/10 rounded-full transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm text-cmail-purple hover:bg-cmail-purple/10 rounded-full transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

const SecurityRow = ({ icon: Icon, title, description, action, onClick }) => {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-dark-bg transition-colors">
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-dark-text-secondary" />
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-dark-text-secondary">{description}</div>
        </div>
      </div>
      <button 
        onClick={onClick}
        className="px-4 py-2 text-sm text-cmail-purple hover:bg-cmail-purple/10 rounded-full transition-colors"
      >
        {action}
      </button>
    </div>
  )
}

const PrivacyCard = ({ title, description }) => {
  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border hover:border-cmail-purple transition-colors cursor-pointer">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-dark-text-secondary">{description}</p>
    </div>
  )
}

const DataRow = ({ icon: Icon, title, description, onClick, danger }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-6 hover:bg-dark-bg transition-colors text-left ${
        danger ? 'hover:bg-red-500/10' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 ${
          danger ? 'text-red-500' : 'text-dark-text-secondary'
        }`} />
        <div>
          <div className={`font-medium ${
            danger ? 'text-red-500' : 'text-dark-text'
          }`}>{title}</div>
          <div className="text-sm text-dark-text-secondary">{description}</div>
        </div>
      </div>
    </button>
  )
}

export default AccountSettings

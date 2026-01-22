import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MenuProvider } from './context/MenuContext'
import ProtectedRoute from './components/ProtectedRoute'
import AccountSelector from './components/AccountSelector'
import Footer from './components/Footer'
import { validateAttribution, isCreator } from './utils/attribution'
import './styles/mobile.css'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Inbox from './pages/Inbox'
import EmailView from './pages/EmailView'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import VerifyMagicLink from './pages/VerifyMagicLink'
import Starred from './pages/Starred'
import Snoozed from './pages/Snoozed'
import Sent from './pages/Sent'
import Drafts from './pages/Drafts'
import Important from './pages/Important'
import Scheduled from './pages/Scheduled'
import AllMail from './pages/AllMail'
import Spam from './pages/Spam'
import Trash from './pages/Trash'
import Subscriptions from './pages/Subscriptions'
import ManageLabels from './pages/ManageLabels'
import CreateLabel from './pages/CreateLabel'
import LabelView from './pages/LabelView'
import AccountSettings from './pages/AccountSettings'
import Settings from './pages/Settings'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import DeveloperDashboard from './pages/DeveloperDashboard'
import DeveloperDocs from './pages/DeveloperDocs'
import OAuthAuthorize from './pages/OAuthAuthorize'

// Validate attribution on app load
if (typeof window !== 'undefined') {
  validateAttribution()
}

function App() {
  return (
    <MenuProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/verify-magic-link/:token" element={<VerifyMagicLink />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email/:id"
            element={
              <ProtectedRoute>
                <EmailView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/starred"
            element={
              <ProtectedRoute>
                <Starred />
              </ProtectedRoute>
            }
          />
          <Route
            path="/snoozed"
            element={
              <ProtectedRoute>
                <Snoozed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sent"
            element={
              <ProtectedRoute>
                <Sent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drafts"
            element={
              <ProtectedRoute>
                <Drafts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/important"
            element={
              <ProtectedRoute>
                <Important />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheduled"
            element={
              <ProtectedRoute>
                <Scheduled />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all"
            element={
              <ProtectedRoute>
                <AllMail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spam"
            element={
              <ProtectedRoute>
                <Spam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trash"
            element={
              <ProtectedRoute>
                <Trash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labels"
            element={
              <ProtectedRoute>
                <ManageLabels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labels/create"
            element={
              <ProtectedRoute>
                <CreateLabel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/label/:label"
            element={
              <ProtectedRoute>
                <LabelView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/developer" element={<DeveloperDocs />} />
          <Route
            path="/developer/dashboard"
            element={
              <ProtectedRoute>
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/oauth/authorize" element={<OAuthAuthorize />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
        <AccountSelector />
        <Footer isCreator={isCreator()} />
      </Router>
    </AuthProvider>
  </MenuProvider>
  )
}

export default App

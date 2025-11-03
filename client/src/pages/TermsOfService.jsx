import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CmailLogo from '../components/CmailLogo'

const TermsOfService = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-dark-bg rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <CmailLogo />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-dark-text-secondary mb-8">Last updated: November 3, 2025</p>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              Welcome to Cmail. These Terms of Service ("Terms") govern your access to and use of Cmail's 
              services, including our email platform, applications, and websites (collectively, the "Services"). 
              By accessing or using our Services, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
            <div className="space-y-3 text-dark-text-secondary leading-relaxed">
              <p>
                <strong className="text-dark-text">2.1 Eligibility:</strong> You must be at least 13 years old to use Cmail. 
                By creating an account, you represent that you meet this age requirement.
              </p>
              <p>
                <strong className="text-dark-text">2.2 Account Security:</strong> You are responsible for maintaining 
                the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p>
                <strong className="text-dark-text">2.3 Accurate Information:</strong> You agree to provide accurate, 
                current, and complete information during registration and to update such information to keep it accurate.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>
            <p className="text-dark-text-secondary leading-relaxed mb-3">
              You agree not to use the Services to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-dark-text-secondary ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Send spam, phishing emails, or malicious content</li>
              <li>Infringe upon intellectual property rights of others</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Distribute viruses, malware, or other harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or store personal data about other users without consent</li>
            </ul>
          </section>

          {/* Content and Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Content and Intellectual Property</h2>
            <div className="space-y-3 text-dark-text-secondary leading-relaxed">
              <p>
                <strong className="text-dark-text">4.1 Your Content:</strong> You retain all rights to the content 
                you create, upload, or share through Cmail. By using our Services, you grant us a license to store, 
                process, and transmit your content as necessary to provide the Services.
              </p>
              <p>
                <strong className="text-dark-text">4.2 Our Intellectual Property:</strong> Cmail and its original 
                content, features, and functionality are owned by Cmail and are protected by international copyright, 
                trademark, and other intellectual property laws.
              </p>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your 
              personal information. By using Cmail, you agree to our Privacy Policy.
            </p>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Service Availability</h2>
            <div className="space-y-3 text-dark-text-secondary leading-relaxed">
              <p>
                <strong className="text-dark-text">6.1 Uptime:</strong> We strive to provide reliable service but 
                cannot guarantee uninterrupted access. We may suspend or terminate Services for maintenance, updates, 
                or other operational reasons.
              </p>
              <p>
                <strong className="text-dark-text">6.2 Modifications:</strong> We reserve the right to modify, 
                suspend, or discontinue any aspect of the Services at any time with or without notice.
              </p>
            </div>
          </section>

          {/* Storage and Data Limits */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Storage and Data Limits</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              Free accounts include 15 GB of storage. Additional storage may be purchased through premium plans. 
              We reserve the right to impose reasonable limits on storage, bandwidth, and other resources.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <div className="space-y-3 text-dark-text-secondary leading-relaxed">
              <p>
                <strong className="text-dark-text">8.1 By You:</strong> You may terminate your account at any time 
                through your account settings.
              </p>
              <p>
                <strong className="text-dark-text">8.2 By Us:</strong> We may suspend or terminate your account if 
                you violate these Terms or engage in conduct that we determine to be harmful to other users or our Services.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
              OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CMAIL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
              DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              You agree to indemnify and hold harmless Cmail and its officers, directors, employees, and agents 
              from any claims, damages, losses, liabilities, and expenses arising out of your use of the Services 
              or violation of these Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in 
              which Cmail operates, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              We may update these Terms from time to time. We will notify you of any material changes by posting 
              the new Terms on this page and updating the "Last updated" date. Your continued use of the Services 
              after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-dark-card rounded-lg border border-dark-border">
              <p className="text-dark-text">Email: legal@cmail.com</p>
              <p className="text-dark-text">Address: Cmail Legal Department</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-dark-border text-center text-sm text-dark-text-secondary">
          <p>© 2025 Cmail. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService

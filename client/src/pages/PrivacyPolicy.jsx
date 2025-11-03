import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CmailLogo from '../components/CmailLogo'

const PrivacyPolicy = () => {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-dark-text-secondary mb-8">Last updated: November 3, 2025</p>

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              At Cmail, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our email services. Please read this policy carefully to 
              understand our practices regarding your personal data.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-dark-text">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-dark-text-secondary ml-4">
                  <li><strong className="text-dark-text">Account Information:</strong> Name, email address, password, and profile picture</li>
                  <li><strong className="text-dark-text">Email Content:</strong> Messages, attachments, and metadata you send or receive</li>
                  <li><strong className="text-dark-text">Contact Information:</strong> Phone number, birthday, and address (optional)</li>
                  <li><strong className="text-dark-text">Payment Information:</strong> Billing details for premium services (processed securely by third-party payment processors)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2 text-dark-text">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-dark-text-secondary ml-4">
                  <li><strong className="text-dark-text">Usage Data:</strong> IP address, browser type, device information, and operating system</li>
                  <li><strong className="text-dark-text">Log Data:</strong> Access times, pages viewed, and actions taken within the service</li>
                  <li><strong className="text-dark-text">Cookies:</strong> Small data files stored on your device to enhance user experience</li>
                  <li><strong className="text-dark-text">Location Data:</strong> Approximate location based on IP address</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-dark-text-secondary leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-dark-text-secondary ml-4">
              <li>To provide, maintain, and improve our email services</li>
              <li>To process and deliver your emails and attachments</li>
              <li>To authenticate your identity and prevent fraud</li>
              <li>To send you service-related notifications and updates</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To analyze usage patterns and optimize service performance</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          {/* Data Storage and Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <div className="space-y-3 text-dark-text-secondary leading-relaxed">
              <p>
                <strong className="text-dark-text">4.1 Encryption:</strong> All emails and attachments are encrypted 
                in transit using TLS (Transport Layer Security) and at rest using industry-standard encryption protocols.
              </p>
              <p>
                <strong className="text-dark-text">4.2 Data Centers:</strong> Your data is stored in secure, 
                geographically distributed data centers with redundant backups to ensure availability and durability.
              </p>
              <p>
                <strong className="text-dark-text">4.3 Access Controls:</strong> We implement strict access controls 
                and authentication mechanisms to prevent unauthorized access to your data.
              </p>
              <p>
                <strong className="text-dark-text">4.4 Security Monitoring:</strong> We continuously monitor our 
                systems for security threats and vulnerabilities.
              </p>
            </div>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-dark-text-secondary leading-relaxed mb-3">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-dark-text-secondary ml-4">
              <li><strong className="text-dark-text">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              <li><strong className="text-dark-text">Service Providers:</strong> With trusted third-party vendors who help us operate our services (e.g., cloud hosting, payment processing)</li>
              <li><strong className="text-dark-text">Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong className="text-dark-text">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong className="text-dark-text">Protection of Rights:</strong> To protect the rights, property, or safety of Cmail, our users, or the public</li>
            </ul>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
            <p className="text-dark-text-secondary leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-dark-text-secondary ml-4">
              <li><strong className="text-dark-text">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-dark-text">Correction:</strong> Update or correct inaccurate information</li>
              <li><strong className="text-dark-text">Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong className="text-dark-text">Export:</strong> Download your emails and data in a portable format</li>
              <li><strong className="text-dark-text">Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong className="text-dark-text">Object:</strong> Object to certain types of data processing</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
            <div className="space-y-3 text-dark-text-secondary leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your experience. Cookies are small text 
                files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Keep you signed in to your account</li>
                <li>Analyze usage patterns and improve our services</li>
                <li>Provide personalized features</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. However, disabling cookies may limit some 
                features of our service.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and comply with 
              legal obligations. When you delete your account, we will delete or anonymize your personal data within 
              90 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              Cmail is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If we become aware that we have collected such information, 
              we will take steps to delete it promptly.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure that such transfers comply with applicable data protection laws and implement appropriate 
              safeguards to protect your information.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Third-Party Links</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              Our service may contain links to third-party websites or services. We are not responsible for the 
              privacy practices of these third parties. We encourage you to review their privacy policies before 
              providing any personal information.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal 
              requirements. We will notify you of any material changes by posting the updated policy on this page 
              and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-dark-text-secondary leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="p-4 bg-dark-card rounded-lg border border-dark-border space-y-2">
              <p className="text-dark-text"><strong>Email:</strong> privacy@cmail.com</p>
              <p className="text-dark-text"><strong>Data Protection Officer:</strong> dpo@cmail.com</p>
              <p className="text-dark-text"><strong>Address:</strong> Cmail Privacy Department</p>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section className="bg-cmail-purple/10 border border-cmail-purple/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">GDPR Compliance</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). 
              You have additional rights under GDPR, including the right to lodge a complaint with a supervisory authority 
              and the right to data portability. We process your data based on your consent, contractual necessity, 
              legal obligations, and our legitimate interests.
            </p>
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

export default PrivacyPolicy

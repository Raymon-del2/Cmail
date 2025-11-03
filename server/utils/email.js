const nodemailer = require('nodemailer');

// Create transporter - supports both Brevo and Gmail
const createTransporter = () => {
  // Check if using Brevo API key
  if (process.env.BREVO_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER || 'your-email@example.com',
        pass: process.env.BREVO_API_KEY
      }
    });
  }
  
  // Fallback to Gmail/custom SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
exports.sendEmail = async (options) => {
  // Check if email service is configured
  if (!process.env.BREVO_API_KEY && !process.env.EMAIL_USER) {
    console.log('⚠️ Email service not configured - skipping email send');
    return { messageId: 'mock-' + Date.now(), skipped: true };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'C-mail <noreply@cmail.com>',
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    // Don't throw error - just log and return mock response
    console.log('⚠️ Email sending failed - continuing without email');
    return { messageId: 'mock-' + Date.now(), error: error.message };
  }
};

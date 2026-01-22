import React from 'react'

const Footer = ({ isCreator = false }) => {
  if (isCreator) {
    // Creator doesn't need to show the attribution
    return null
  }

  return (
    <footer className="bg-dark-bg border-t border-dark-border py-4 px-6 text-center">
      <p className="text-sm text-dark-text-secondary">
        Powered by{' '}
        <a
          href="https://rayfolio.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cmail-purple hover:text-cmail-purple-dark transition-colors"
        >
          Coded Waves
        </a>
      </p>
    </footer>
  )
}

export default Footer

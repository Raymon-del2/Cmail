import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

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
          C-mail {currentYear}
        </a>
      </p>
      <p className="text-xs text-dark-text-secondary mt-2">
        <a
          href="mailto:playra@cmail.vercel.app"
          className="text-cmail-purple hover:text-cmail-purple-dark transition-colors"
        >
          Contact for Pro
        </a>
      </p>
    </footer>
  )
}

export default Footer

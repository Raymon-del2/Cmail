import React, { useState, useEffect } from 'react'
import ProContactModal from './ProContactModal'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showContactButton, setShowContactButton] = useState(false)

  useEffect(() => {
    // Only show Contact for Pro button on domains other than c-mail.vercel.app
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      setShowContactButton(hostname !== 'c-mail.vercel.app')
    }
  }, [])

  return (
    <>
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
        {showContactButton && (
          <p className="text-xs text-dark-text-secondary mt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-cmail-purple hover:text-cmail-purple-dark transition-colors bg-transparent border-none cursor-pointer"
            >
              Contact for Pro
            </button>
          </p>
        )}
      </footer>
      <ProContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default Footer

const CmailLogo = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <img 
      src="/cmail-icon.svg" 
      alt="C-mail Logo" 
      className={`${sizes[size]} rounded-lg`}
    />
  )
}

export default CmailLogo

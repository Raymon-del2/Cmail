// Circular Spinner Loader
const Loader = ({ size = 'md', type = 'spinner' }) => {
  const sizes = {
    sm: { width: 'w-8 h-8', border: 'border-2' },
    md: { width: 'w-12 h-12', border: 'border-3' },
    lg: { width: 'w-16 h-16', border: 'border-4' }
  }

  const currentSize = sizes[size]

  // Type 1: Spinning Border (Default)
  if (type === 'spinner') {
    return (
      <div className={`${currentSize.width} ${currentSize.border} border-cmail-purple border-t-transparent rounded-full animate-spin`}></div>
    )
  }

  // Type 2: Double Ring
  if (type === 'ring') {
    return (
      <div className={`${currentSize.width} relative`}>
        <style>{`
          @keyframes ring {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .ring-outer {
            animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border: 3px solid transparent;
            border-top-color: #8b5cf6;
            border-radius: 50%;
          }
          .ring-inner {
            animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            animation-delay: -0.45s;
            border: 3px solid transparent;
            border-top-color: #a78bfa;
            border-radius: 50%;
          }
        `}</style>
        <div className={`${currentSize.width} ring-outer absolute`}></div>
        <div className={`${currentSize.width} ring-inner absolute`} style={{ width: '80%', height: '80%', top: '10%', left: '10%' }}></div>
      </div>
    )
  }

  // Type 3: Dots Circle
  if (type === 'dots') {
    return (
      <div className={`${currentSize.width} relative`}>
        <style>{`
          @keyframes circular-dots {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.8); }
          }
          .dot {
            position: absolute;
            width: 20%;
            height: 20%;
            background: #8b5cf6;
            border-radius: 50%;
            animation: circular-dots 1.2s linear infinite;
          }
          .dot:nth-child(1) { top: 0; left: 40%; animation-delay: 0s; }
          .dot:nth-child(2) { top: 10%; right: 10%; animation-delay: -0.15s; }
          .dot:nth-child(3) { top: 40%; right: 0; animation-delay: -0.3s; }
          .dot:nth-child(4) { bottom: 10%; right: 10%; animation-delay: -0.45s; }
          .dot:nth-child(5) { bottom: 0; left: 40%; animation-delay: -0.6s; }
          .dot:nth-child(6) { bottom: 10%; left: 10%; animation-delay: -0.75s; }
          .dot:nth-child(7) { top: 40%; left: 0; animation-delay: -0.9s; }
          .dot:nth-child(8) { top: 10%; left: 10%; animation-delay: -1.05s; }
        `}</style>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    )
  }

  // Default to spinner
  return (
    <div className={`${currentSize.width} ${currentSize.border} border-cmail-purple border-t-transparent rounded-full animate-spin`}></div>
  )
}

export default Loader

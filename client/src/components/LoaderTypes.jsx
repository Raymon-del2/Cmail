// Collection of different circular loader types

// Type 1: Spinning Circle (Border)
export const SpinnerLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  }

  return (
    <div className={`${sizes[size]} border-cmail-purple border-t-transparent rounded-full animate-spin`}></div>
  )
}

// Type 2: Pulsing Circle
export const PulseLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className="relative">
      <div className={`${sizes[size]} bg-cmail-purple rounded-full animate-ping absolute`}></div>
      <div className={`${sizes[size]} bg-cmail-purple rounded-full relative`}></div>
    </div>
  )
}

// Type 3: Dots Loader
export const DotsLoader = ({ size = 'md' }) => {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className="flex space-x-2">
      <div className={`${dotSizes[size]} bg-cmail-purple rounded-full animate-bounce`}></div>
      <div className={`${dotSizes[size]} bg-cmail-purple rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`${dotSizes[size]} bg-cmail-purple rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  )
}

// Type 4: Ring Loader (Double Border)
export const RingLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizes[size]} relative`}>
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
      <div className={`${sizes[size]} ring-outer absolute`}></div>
      <div className={`${sizes[size]} ring-inner absolute`} style={{ width: '80%', height: '80%', top: '10%', left: '10%' }}></div>
    </div>
  )
}

// Type 5: Circle Segments Loader
export const SegmentsLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizes[size]} relative`}>
      <style>{`
        @keyframes segments {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .segment {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-radius: 50%;
          animation: segments 1s linear infinite;
        }
        .segment:nth-child(1) {
          border-top-color: #8b5cf6;
          animation-delay: 0s;
        }
        .segment:nth-child(2) {
          border-right-color: #a78bfa;
          animation-delay: -0.25s;
        }
        .segment:nth-child(3) {
          border-bottom-color: #c4b5fd;
          animation-delay: -0.5s;
        }
        .segment:nth-child(4) {
          border-left-color: #ddd6fe;
          animation-delay: -0.75s;
        }
      `}</style>
      <div className="segment"></div>
      <div className="segment"></div>
      <div className="segment"></div>
      <div className="segment"></div>
    </div>
  )
}

// Type 6: Circular Dots
export const CircularDotsLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizes[size]} relative`}>
      <style>{`
        @keyframes circular-dots {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
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

// Default export - choose your favorite!
export default SpinnerLoader

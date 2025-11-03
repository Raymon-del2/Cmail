// Compass Loader - For app loading screen
const CompassLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  return (
    <div className={`compass-loader ${sizes[size]}`}>
      <style>{`
        .compass-loader {
          position: relative;
          background: #8b5cf6;
          border-radius: 50%;
          transform: rotate(45deg);
          animation: rotate 2s linear infinite;
        }
        .compass-loader:before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 15px;
          height: 30px;
          background: #FF3D00;
          transform: skew(5deg, 60deg) translate(-50%, -5%);
        }
        .compass-loader:after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FFF;
          transform: translate(-50%, -50%);
        }
        @keyframes rotate {
          0% { transform: rotate(45deg); }
          30%, 50%, 70% { transform: rotate(230deg); }
          40%, 60%, 80% { transform: rotate(240deg); }
          100% { transform: rotate(245deg); }
        }
      `}</style>
    </div>
  )
}

export default CompassLoader

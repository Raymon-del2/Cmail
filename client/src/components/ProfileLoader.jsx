// Profile Loader - Bouncing balls animation
const ProfileLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-[84px] h-[84px]',
    lg: 'w-24 h-24'
  }

  return (
    <div className={`profile-loader ${sizes[size]}`}>
      <style>{`
        .profile-loader {
          position: relative;
          overflow: hidden;
        }
        .profile-loader:before,
        .profile-loader:after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 76%;
          height: 76%;
          border-radius: 50%;
          background: #8b5cf6;
          transform: translate(-50%, 100%) scale(0);
          animation: push 2s infinite ease-in;
        }
        .profile-loader:after {
          animation-delay: 1s;
        }
        @keyframes push {
          0% {
            transform: translate(-50%, 100%) scale(1);
          }
          15%, 25% {
            transform: translate(-50%, 50%) scale(1);
          }
          50%, 75% {
            transform: translate(-50%, -30%) scale(0.5);
          }
          80%, 100% {
            transform: translate(-50%, -50%) scale(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ProfileLoader

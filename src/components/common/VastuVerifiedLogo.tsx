import React from 'react'

interface VastuVerifiedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const VastuVerifiedLogo: React.FC<VastuVerifiedLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  // Size classes for the shield icon
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }

  // Size classes for the text badge
  const textBadgeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-5 py-2.5 text-lg'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Shield Icon */}
      <div className={`${iconSizeClasses[size]} relative`}>
        <img
          src="/icon.png"
          alt="VastuVerified Icon"
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {/* Text Badge */}
      {showText && (
        <div className={`bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-bold flex flex-col justify-center items-center leading-none drop-shadow-md ${textBadgeClasses[size]}`}>
          <span className="uppercase">VASTU</span>
          <span className="uppercase">verified</span>
        </div>
      )}
    </div>
  )
}

export default VastuVerifiedLogo

import React from 'react'

interface VastuVerifiedIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const VastuVerifiedIcon: React.FC<VastuVerifiedIconProps> = ({ 
  size = 'sm', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      <img
        src="/icon.png"
        alt="VastuVerified Icon"
        className="w-full h-full object-contain drop-shadow-sm"
      />
    </div>
  )
}

export default VastuVerifiedIcon

/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 2025-04-01
 * Header component for the application.
 */

import React from 'react'
import Logo from '../assets/logo.png';

const Header = () => {
  return (
    <>
      {/* Grey Box + Logo */}
      <div className="flex flex-col items-center bg-gray-700 rounded-t-lg">
        <img
            src={Logo}
            alt="School Logo"
            className="w-25 h-25 rounded-full "
        />
      </div>
    </>
  )
}

export default Header
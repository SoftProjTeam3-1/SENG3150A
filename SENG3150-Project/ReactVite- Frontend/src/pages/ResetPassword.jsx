/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 2025-04-01
 * Description: This component is used to render the reset password page.
 * It includes the ResetPasswordForm component which is used to reset the password.
 */

import React from 'react';
import ResetPasswordForm from '../components/ResetPassword/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <ResetPasswordForm />
    </div> 
  </>
  )
}

export default ResetPassword
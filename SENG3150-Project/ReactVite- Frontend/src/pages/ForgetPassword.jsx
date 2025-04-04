/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 2025-04-01
 * Description: This component is used to render the forget password page.
 * It includes the ForgetPasswordEmailEntryForm component which is used to enter the email address for password reset.
 */
import React from 'react';
import ForgetPasswordEmailEntryForm from '../components/ForgetPassword/ForgetPasswordEmailEntryForm';

const ForgetPassword = () => {
  return (
    <>
    <script type="module" src="../validation-loader.js"></script>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <ForgetPasswordEmailEntryForm/>
    </div> 
  </>
  )
}

export default ForgetPassword
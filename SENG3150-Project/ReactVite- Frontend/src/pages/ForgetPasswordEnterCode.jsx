/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 2025-04-01
 * Description: This component is used to render the forget password enter code page.
 * It includes the ForgetPasswordEnterCodeForm component which is used to enter the code for password reset.
 */

import React from 'react';
import ForgetPasswordEnterCodeForm from '../components/ForgetPassword/ForgetPasswordEnterCodeForm';

const ForgetPasswordEnterCode = () => {
  return (
    <>
      <script type="module" src="../validation-loader.js"></script>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <ForgetPasswordEnterCodeForm /> 
      </div> 
    </>
  )
}

export default ForgetPasswordEnterCode
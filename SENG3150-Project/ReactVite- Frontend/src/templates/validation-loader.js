/*
Author: Oscar Scorgie
Date: 26/03/2025
Description: This is a file that loads the validations based on the type of form submitted.
*/

import { validateLogin, validateRegister } from '../lib/validation.js';


/*
    handleFormSubmit():
        Description: When the form is submitted we determine the page it was submitted from
        and which validation method to use.

        Returns:
        Returns the validation results whether its true or false and an alert of errors
*/
window.handleFormSubmit = function () {
    const currentPage = window.location.pathname;

    //  Determines the page and which validation method to use
    if (currentPage.includes("login.html")) {
        console.log("login ");
        return validateLogin("emailLogin", "passwordLogin");
    } else if (currentPage.includes("register.html")) {
        console.log("Register ");
        return validateRegister("emailLogin", "passwordRegister", "confirmPasswordRegister");
    }
};


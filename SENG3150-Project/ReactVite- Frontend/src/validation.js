/*
Author: Oscar Scorgie
Date: 26/03/2025
Description:    This is a file that contains all the validation functions.
*/


/*
    validateEmail(emailId):
        Description: Validates an email input field by its ID.

        Parameters:
        - emailId: The specific id that correlates to the email from the html doc

        Returns:
        Returns false if validation fails (and display's alert), true otherwise.
*/
export function validateEmail(emailId) {
    //  Get the Element ID
    const email = document.getElementById(emailId).value.trim();

    //  Initialise the error log
    let errorLog = [];

    //  Test the email is not left blank
    if (!email){
        errorLog.push("- Email is required.");
    }

    //  Test the email is valid via an @ symbol
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorLog.push("- Please enter a valid email address");
        return false;
    }

    //  If there are errors, join them together for an alert
    //  Return false since there are still errors the User has not passed
    if (errorLog.length > 0) {
        alert(errorLog.join("\n"));
        return false;
    }

    //  Return true since no errors
    return true;
}


/*
    validatePassword(passwordId):
        Description: Validates a password input

        Parameters:
        - passwordId: The specific id that correlates to the password from the html doc

        Returns:
        Returns false if validation fails (and displays alert), true otherwise.
*/
export function validatePassword(passwordId) {
    //  Get the Element ID
    const password = document.getElementById(passwordId).value.trim();

    //  Initialise the error log
    let errorLog = [];

    //  Test the email is not left blank
    if (!password) {
        errorLog.push("Password is required.");
    } else {
        //  Test the password is greater than 8 characters
        if (password.length < 8) {
            errorLog.push("Password must be at least 8 characters.");
        }
        //  Test the password has at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            errorLog.push("Password must contain at least one uppercase letter.");
        }
        //  Test the password has at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            errorLog.push("Password must contain at least one lowercase letter.");
        }
        //  Test the password has at least one special character
        if (!/[!@#$%^&*(),.?\\":{}|<>]/.test(password)) {
            errorLog.push("Password must include a special character.");
        }
    }

    //  If there are errors, join them together for an alert
    //  Return false since there are still errors the User has not passed
    if (errorLog.length > 0) {
        alert(errorLog.join("\n"));
        return false;
    }

    //  Return true since no errors
    return true;
}


export function validateForm(emailId, passwordId) {
    const emailValid = validateEmail(emailId);
    const passwordValid = validatePassword(passwordId);
    return emailValid && passwordValid;
}
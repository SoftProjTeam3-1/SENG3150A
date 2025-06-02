/*
Author: Oscar Scorgie
Date: 26/03/2025
Description: This is a file that contains all the validation functions.
*/
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*
    validateEmail(emailId):
        Description: Validates an email input field by its ID.

        Parameters:
        - emailId: The specific id that correlates to the email from the html doc

        Returns:
        Returns false if validation fails with an array of the error log, true otherwise.
*/
export function validateEmail({email}) {
    //  Get the Element ID
    //const email = document.getElementById(emailId).value.trim();



    //  Initialise the error log
    let errorLog = [];

    //  Test the email is not left blank
    if (!email){
        errorLog.push("Email is required.");
    }

    //  Test the email is valid via an @ symbol
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorLog.push("- Please enter a valid email address.");
    }

    //  Return false if there are errors else true
    //  If there are errors returns error log
    return {
        Valid: errorLog.length === 0,
        Data: errorLog
    };
}


export function validateNumbers({numbers}) {
    //  Get the Element ID
    //const email = document.getElementById(emailId).value.trim();



    //  Initialise the error log
    let errorLog = [];

    //  Test the email is not left blank
    if (!numbers){
        errorLog.push("Authentication code is required.");
    }

    if(numbers.length < 8){
        errorLog.push("- Authentication code must be at least 8 characters.");
    }

    //  Test the authentication code is just numbers
    if (!/^\d+$/.test(numbers)) {
        errorLog.push("-- Authentication code must contain only numbers.");
    }

    //  Return false if there are errors else true
    //  If there are errors returns error log
    return {
        Valid: errorLog.length === 0,
        Data: errorLog
    };
}


/*
    validatePassword(passwordId):
        Description: Validates a password input

        Parameters:
        - passwordId: The specific id that correlates to the password from the html doc

        Returns:
        Returns false if validation fails with an array of the error log, true otherwise.
*/
export function validatePassword({password}) {
    //  Get the Element ID
    //const password = document.getElementById(passwordId).value.trim();

    //  Initialise the error log
    let errorLog = [];

    //  Test the email is not left blank
    if (!password) {
        errorLog.push("Password is required.");
    } else {
        //  Test the password is greater than 8 characters
        if (password.length < 8) {
            errorLog.push("- Password must be at least 8 characters.");
        }
        //  Test the password has at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            errorLog.push("- Password must contain at least one uppercase letter.");
        }
        //  Test the password has at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            errorLog.push("- Password must contain at least one lowercase letter.");
        }
        //  Test the password has at least one special character
        if (!/[!@#$%^&*(),.?\\":{}|<>]/.test(password)) {
            errorLog.push("- Password must include a special character.");
        }
    }

    //  Return false if there are errors else true
    //  If there are errors returns error log
    return {
        Valid: errorLog.length === 0,
        Data: errorLog
    };
}


/*
    matchingPasswords(passwordId1, passwordId2):
        Description: Determines two passwords equal each other

        Parameters:
        - passwordId1: The specific id that correlates to the password1 from the html doc
        - passwordId2: The specific id that correlates to the password2 from the html doc

        Returns:
        Returns false if both passwords are not equal with an array of the error log, true otherwise.
*/
export function matchingPasswords({password1, password2}){

    //const password1 = document.getElementById(passwordId1).value.trim();
    //const password2 = document.getElementById(passwordId2).value.trim();

    let errorLog = [];

    //  If not push an error to the error log
    if (password1 !== password2) {
        errorLog.push("- Passwords do not match.");
    }

    return {
        Valid: errorLog.length === 0,
        Data: errorLog
    };
}

/*
    validateForm(emailId, passwordId):
        Description: Validates both validation methods

        Parameters:
        - emailId: The specific id that correlates to the email from the html doc
        - passwordId: The specific id that correlates to the password from the html doc

        Returns:
        Returns false if validation fails (and displays alert), true otherwise.
*/
export function validateLogin({emailId, passwordId}) {
    //  Runs all validation functions
    const emailResult = validateEmail({email:emailId});
    const passwordResult = validatePassword({password:passwordId});


    //  Saves the data from the validation to
    const emailValid = emailResult.Valid;
    const passwordValid = passwordResult.Valid;

    //  Joins the error logs together
    const errorLog = [...emailResult.Data];

    if (errorLog.length === 0){
        errorLog.push("Unable to Login");
    }

    //  Returns a boolean of the decision
    //  Can be used as another form of verification
    //  if the alert lets the user through for some reason
    return { valid: emailValid && passwordValid, errors: errorLog };
}


/*
    validateRegister(emailId, passwordId, confirmPasswordId):
        Description: Validates all validation methods

        Parameters:
        - emailId: The specific id that correlates to the email from the html doc
        - passwordId: The specific id that correlates to the password from the html doc
        - confirmPasswordId: The specific id that correlates to the confirmation password
                             from the html doc

        Returns:
        Returns false if validation fails (and displays alert), true otherwise.
*/
export function validateRegister({emailId, passwordId, confirmPasswordId}) {
    //  Runs all validation functions
    const emailResult = validateEmail({email:emailId});
    const passwordResult = validatePassword({password:passwordId});
    const matchingPasswordsResult = matchingPasswords(
        {password1:passwordId, password2:confirmPasswordId});
    //console.log(passwordId, confirmPasswordId);

    //  Saves the data from the validation to
    const emailValid = emailResult.Valid;
    const passwordValid = passwordResult.Valid;
    const matchingPasswordsValid = matchingPasswordsResult.Valid;

    //  Joins the error logs together
    const errorLog = [...emailResult.Data, ...passwordResult.Data, ...matchingPasswordsResult.Data];

    //  Returns a boolean of the decision
    //  Can be used as another form of verification
    //  if the alert lets the user through for some reason
    return {valid: emailValid && passwordValid && matchingPasswordsValid, errors: errorLog};
}

export function validateForgotPasswordEmail({emailId}){
    const emailResult = validateEmail({email:emailId});

    //  Saves the data from the validation to
    const emailValid = emailResult.Valid;

    //  Joins the error logs together
    const errorLog = [...emailResult.Data]

    //  Returns a boolean of the decision
    //  Can be used as another form of verification
    //  if the alert lets the user through for some reason
    return {valid: emailValid, errors: errorLog};
}


export function validateForgotPasswordNumbers({numbersId}){
    const numbersResult = validateNumbers({numbers:numbersId});

    const numbersValid = numbersResult.Valid;

    const errorLog = [...numbersResult.Data]

    //  Separates the error messages with a new line
    if (errorLog.length > 0) {
        toast.error(errorLog.join("\n"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    }

    return numbersValid;
}

export function validateResetPassword({password1, password2}){
    const matchingResults = matchingPasswords({password1:password1,password2:password2})
    const paswordValidatedRsults = validatePassword({password:password1})

    const errorLog = [...matchingResults.Data, ...paswordValidatedRsults.Data]

    //  Separates the error messages with a new line
    if (errorLog.length > 0) {
        toast.error(errorLog.join("\n"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    }

    return matchingResults.Valid && paswordValidatedRsults.Valid;
}


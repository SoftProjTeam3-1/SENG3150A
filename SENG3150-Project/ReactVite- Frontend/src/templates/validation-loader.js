

import { validateForm } from '../validation.js';

window.handleFormSubmit = function () {
    return validateForm("emailLogin", "passwordLogin");
};


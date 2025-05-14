document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const ageInput = document.getElementById('ageInput');
    const passwordInput = document.getElementById('passwordInput');
    const repasswordInput = document.getElementById('repasswordInput');
    const submitBtn = document.getElementById('submitBtn');

    const validations = {
        name: {
            regex: /^[a-zA-Z\s]{2,30}$/,
            message: 'Name must be 2-30 characters long and contain only letters'
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            regex: /^\d{10,15}$/,
            message: 'Phone number must be 10-15 digits'
        },
        age: {
            regex: /^(?:[1-9]|[1-9][0-9]|1[0-1][0-9]|120)$/,
            message: 'Age must be between 1 and 120'
        },
        password: {
            regex: /^.{6,}$/,
            message: 'Password must be at least 6 characters long'
        }
    };

    function validateInput(input, validationType) {
        const validation = validations[validationType];
        const isValid = validation.regex.test(input.value);
        
        input.classList.remove('is-valid', 'is-invalid');
        input.classList.add(isValid ? 'is-valid' : 'is-invalid');
        
        return isValid;
    }

    function validatePasswordMatch() {
        const match = passwordInput.value === repasswordInput.value;
        repasswordInput.classList.remove('is-valid', 'is-invalid');
        repasswordInput.classList.add(match ? 'is-valid' : 'is-invalid');
        return match;
    }

    function validateForm() {
        const isNameValid = validateInput(nameInput, 'name');
        const isEmailValid = validateInput(emailInput, 'email');
        const isPhoneValid = validateInput(phoneInput, 'phone');
        const isAgeValid = validateInput(ageInput, 'age');
        const isPasswordValid = validateInput(passwordInput, 'password');
        const isPasswordMatch = validatePasswordMatch();

        submitBtn.disabled = !(isNameValid && isEmailValid && isPhoneValid && 
                             isAgeValid && isPasswordValid && isPasswordMatch);
    }

    nameInput.addEventListener('input', () => validateInput(nameInput, 'name'));
    emailInput.addEventListener('input', () => validateInput(emailInput, 'email'));
    phoneInput.addEventListener('input', () => validateInput(phoneInput, 'phone'));
    ageInput.addEventListener('input', () => validateInput(ageInput, 'age'));
    passwordInput.addEventListener('input', () => {
        validateInput(passwordInput, 'password');
        if (repasswordInput.value) validatePasswordMatch();
    });
    repasswordInput.addEventListener('input', validatePasswordMatch);

    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        validateForm();
        
        if (!submitBtn.disabled) {
            console.log('Form submitted successfully');
        }
    });

    document.querySelectorAll('#contactForm input').forEach(input => {
        input.addEventListener('input', validateForm);
    });
});

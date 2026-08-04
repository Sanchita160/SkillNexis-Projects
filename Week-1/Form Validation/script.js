// ============================================
// Form Validation Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const successMessage = document.getElementById('successMessage');

  const fields = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    terms: document.getElementById('terms'),
  };

  const errors = {
    fullName: document.getElementById('fullNameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    terms: document.getElementById('termsError'),
  };

  // ---- Individual field validators ----
  // Each returns an error string, or '' if valid.

  function validateFullName(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Full name is required.';
    if (trimmed.length < 3) return 'Name must be at least 3 characters.';
    if (!/^[A-Za-z\s]+$/.test(trimmed)) return 'Name can only contain letters and spaces.';
    return '';
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Email is required.';
    // Standard, practical email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) return 'Enter a valid email address.';
    return '';
  }

  function validatePhone(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 'Phone number is required.';
    if (!/^[6-9]\d{9}$/.test(trimmed)) return 'Enter a valid 10-digit mobile number.';
    return '';
  }

  function validatePassword(value) {
    if (value === '') return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter.';
    if (!/[a-z]/.test(value)) return 'Include at least one lowercase letter.';
    if (!/[0-9]/.test(value)) return 'Include at least one number.';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Include at least one special character.';
    return '';
  }

  function validateConfirmPassword(value, passwordValue) {
    if (value === '') return 'Please confirm your password.';
    if (value !== passwordValue) return 'Passwords do not match.';
    return '';
  }

  function validateTerms(checked) {
    if (!checked) return 'You must accept the terms to continue.';
    return '';
  }

  // ---- UI helpers ----

  function showError(fieldKey, message) {
    const inputEl = fields[fieldKey];
    const errorEl = errors[fieldKey];
    errorEl.textContent = message;

    if (fieldKey === 'terms') return; // checkbox has no valid/invalid border styling

    if (message) {
      inputEl.classList.add('invalid');
      inputEl.classList.remove('valid');
    } else {
      inputEl.classList.remove('invalid');
      inputEl.classList.add('valid');
    }
  }

  // Runs one field's validation and updates its UI. Returns true if valid.
  function validateField(key) {
    let message = '';
    switch (key) {
      case 'fullName':
        message = validateFullName(fields.fullName.value);
        break;
      case 'email':
        message = validateEmail(fields.email.value);
        break;
      case 'phone':
        message = validatePhone(fields.phone.value);
        break;
      case 'password':
        message = validatePassword(fields.password.value);
        break;
      case 'confirmPassword':
        message = validateConfirmPassword(fields.confirmPassword.value, fields.password.value);
        break;
      case 'terms':
        message = validateTerms(fields.terms.checked);
        break;
    }
    showError(key, message);
    return message === '';
  }

  // ---- Live validation as the user types/checks ----
  Object.keys(fields).forEach((key) => {
    const eventType = key === 'terms' ? 'change' : 'input';
    fields[key].addEventListener(eventType, () => validateField(key));
  });

  // Re-check confirmPassword whenever password changes
  fields.password.addEventListener('input', () => {
    if (fields.confirmPassword.value !== '') {
      validateField('confirmPassword');
    }
  });

  // ---- Form submission ----
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMessage.classList.remove('show');

    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    if (allValid) {
      successMessage.classList.add('show');
      form.reset();
      Object.values(fields).forEach((el) => el.classList.remove('valid', 'invalid'));

      // In a real app, you'd send form data to a server here, e.g.:
      // fetch('/api/register', { method: 'POST', body: new FormData(form) });
    } else {
      // Focus the first invalid field for accessibility
      const firstInvalidKey = Object.keys(fields).find((key) => errors[key].textContent !== '');
      if (firstInvalidKey) fields[firstInvalidKey].focus();
    }
  });
});

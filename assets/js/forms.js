/* ============================================
   IT COMPANY PORTFOLIO - FORMS JS
   Form Validation & Submission Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // CONTACT FORM VALIDATION & SUBMISSION
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    // Real-time validation on blur
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea, .form-select');

    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });

      // Clear error on input
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          const errorElement = document.getElementById(this.id + 'Error');
          if (errorElement) {
            errorElement.textContent = '';
          }
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Check honeypot (spam prevention)
      const honeypot = contactForm.querySelector('input[name="honeypot"]');
      if (honeypot && honeypot.value !== '') {
        console.log('Spam detected');
        return false;
      }

      // Validate all fields
      let isValid = true;
      formInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        submitContactForm(contactForm);
      } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.form-input.error, .form-textarea.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }

  // ============================================
  // CAREERS FORM (Application Form)
  // ============================================
  const careersForm = document.getElementById('careersForm');

  if (careersForm) {
    const formInputs = careersForm.querySelectorAll('.form-input, .form-textarea, .form-select, .form-file-input');

    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          const errorElement = document.getElementById(this.id + 'Error');
          if (errorElement) {
            errorElement.textContent = '';
          }
        }
      });
    });

    // File input handling
    const fileInput = document.getElementById('resume');
    const fileLabel = document.querySelector('.form-file-label');
    const fileName = document.querySelector('.form-file-name');

    if (fileInput) {
      fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
          const file = this.files[0];
          if (fileName) {
            fileName.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
          }
          validateFileUpload(file, this);
        }
      });
    }

    careersForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      formInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        submitCareersForm(careersForm);
      }
    });
  }

  // ============================================
  // FIELD VALIDATION FUNCTION
  // ============================================
  function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(field.id + 'Error');
    let isValid = true;
    let errorMessage = '';

    // Check if field is required
    if (field.hasAttribute('required') && fieldValue === '') {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && fieldValue !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fieldValue)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    // Phone validation (optional but format check if provided)
    else if (field.type === 'tel' && fieldValue !== '') {
      const phoneRegex = /^[\d\s\(\)\-\+]+$/;
      if (!phoneRegex.test(fieldValue) || fieldValue.replace(/\D/g, '').length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    // Message minimum length
    else if (fieldName === 'message' && fieldValue !== '') {
      if (fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
      }
    }
    // URL validation (if applicable)
    else if (field.type === 'url' && fieldValue !== '') {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(fieldValue)) {
        isValid = false;
        errorMessage = 'Please enter a valid URL';
      }
    }

    // Update UI
    if (!isValid) {
      field.classList.add('error');
      field.classList.remove('success');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
    } else {
      field.classList.remove('error');
      if (fieldValue !== '' && field.hasAttribute('required')) {
        field.classList.add('success');
      }
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    return isValid;
  }

  // ============================================
  // FILE UPLOAD VALIDATION
  // ============================================
  function validateFileUpload(file, input) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    let isValid = true;
    let errorMessage = '';

    // Check file size
    if (file.size > maxSize) {
      isValid = false;
      errorMessage = 'File size must be less than 5MB';
    }
    // Check file type
    else if (!allowedTypes.includes(file.type)) {
      isValid = false;
      errorMessage = 'Only PDF and Word documents are allowed';
    }

    const errorElement = document.getElementById(input.id + 'Error');

    if (!isValid) {
      input.classList.add('error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
      input.value = '';
      const fileName = document.querySelector('.form-file-name');
      if (fileName) {
        fileName.textContent = '';
      }
    } else {
      input.classList.remove('error');
      input.classList.add('success');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    return isValid;
  }

  // ============================================
  // CONTACT FORM SUBMISSION
  // ============================================
  function submitContactForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Show loading state
    if (submitButton) {
      window.setLoading(submitButton, true);
    }

    // Hide previous messages
    if (formSuccess) formSuccess.style.display = 'none';
    if (formError) formError.style.display = 'none';

    // Get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (key !== 'honeypot') {
        data[key] = value;
      }
    });

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
      // SUCCESS SIMULATION
      // In production, replace this with actual API call:
      /*
      fetch('https://your-api-endpoint.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        // Handle success
      })
      .catch(error => {
        // Handle error
      });
      */

      // For now, always show success
      if (submitButton) {
        window.setLoading(submitButton, false);
      }

      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form
      form.reset();
      form.querySelectorAll('.success, .error').forEach(el => {
        el.classList.remove('success', 'error');
      });

      // Show toast notification
      if (window.showToast) {
        window.showToast('Message sent successfully!', 'success', 4000);
      }

      // Log data (for development)
      console.log('Form submitted:', data);

    }, 1500);

    // ERROR SIMULATION (uncomment to test error state)
    /*
    setTimeout(() => {
      if (submitButton) {
        window.setLoading(submitButton, false);
      }

      if (formError) {
        formError.style.display = 'block';
        formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (window.showToast) {
        window.showToast('Failed to send message. Please try again.', 'error', 4000);
      }
    }, 1500);
    */
  }

  // ============================================
  // CAREERS FORM SUBMISSION
  // ============================================
  function submitCareersForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('applicationSuccess');
    const formError = document.getElementById('applicationError');

    if (submitButton) {
      window.setLoading(submitButton, true);
    }

    if (formSuccess) formSuccess.style.display = 'none';
    if (formError) formError.style.display = 'none';

    // Get form data (including file)
    const formData = new FormData(form);

    // Simulate API call
    setTimeout(() => {
      if (submitButton) {
        window.setLoading(submitButton, false);
      }

      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
      form.querySelectorAll('.success, .error').forEach(el => {
        el.classList.remove('success', 'error');
      });

      const fileName = document.querySelector('.form-file-name');
      if (fileName) {
        fileName.textContent = '';
      }

      if (window.showToast) {
        window.showToast('Application submitted successfully!', 'success', 4000);
      }

      console.log('Careers form submitted');
    }, 2000);
  }

  // ============================================
  // NEWSLETTER SUBSCRIPTION (if applicable)
  // ============================================
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitButton = form.querySelector('button[type="submit"]');

      if (!emailInput) return;

      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        if (window.showToast) {
          window.showToast('Please enter a valid email address', 'error', 3000);
        }
        emailInput.classList.add('error');
        return;
      }

      if (submitButton) {
        window.setLoading(submitButton, true);
      }

      setTimeout(() => {
        if (submitButton) {
          window.setLoading(submitButton, false);
        }

        if (window.showToast) {
          window.showToast('Successfully subscribed to newsletter!', 'success', 3000);
        }

        form.reset();
        console.log('Newsletter subscription:', email);
      }, 1000);
    });
  });

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // ============================================
  // FORM AUTO-SAVE (Optional - localStorage)
  // ============================================
  function enableFormAutoSave(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const storageKey = `form_${formId}_autosave`;

    // Load saved data
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field && field.type !== 'file') {
            field.value = data[key];
          }
        });
      } catch (e) {
        console.error('Error loading form data:', e);
      }
    }

    // Save on input
    const inputs = form.querySelectorAll('input:not([type="file"]), textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', debounce(function() {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
          if (key !== 'honeypot') {
            data[key] = value;
          }
        });
        localStorage.setItem(storageKey, JSON.stringify(data));
      }, 500));
    });

    // Clear on successful submit
    form.addEventListener('submit', function() {
      setTimeout(() => {
        localStorage.removeItem(storageKey);
      }, 2000);
    });
  }

  // Debounce function for auto-save
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Enable auto-save for contact form (optional)
  // enableFormAutoSave('contactForm');

  // ============================================
  // LOG INITIALIZATION
  // ============================================
  console.log('Form validation initialized');

});

// ============================================
// EMAILJS INTEGRATION (Optional)
// ============================================
/*
To use EmailJS for form submissions:

1. Sign up at https://www.emailjs.com/
2. Create an email service and template
3. Add this code:

emailjs.init("YOUR_USER_ID");

function submitContactForm(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", data)
    .then(() => {
      // Show success message
    })
    .catch((error) => {
      // Show error message
    });
}
*/

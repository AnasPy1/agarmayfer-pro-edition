// Language selection
let currentLanguage = localStorage.getItem('language') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Initialize translations
    updateTranslations();

    // Set up language switcher if it exists
    const languageSwitcher = document.getElementById('languageSwitcher');
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            updateTranslations();
        });
        languageSwitcher.value = currentLanguage;
    }
});

function updateTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.innerHTML = translations[currentLanguage][key];
            }
        }
    });

    // Update form validation messages
    updateFormValidationMessages();
}

function updateFormValidationMessages() {
    const form = document.getElementById('contactForm');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.dataset.validationMessage = translations[currentLanguage]['requiredField'];
            if (input.type === 'email') {
                input.dataset.emailMessage = translations[currentLanguage]['invalidEmail'];
            }
        });
    }
}

function showNotification(messageKey, type = 'success') {
    const message = translations[currentLanguage][messageKey] || messageKey;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Validate form
    if (!validateForm(formData)) {
        return;
    }

    try {
        // This will be replaced with actual backend call later
        await mockContactAPI(formData);
        showNotification('messageSent');
        e.target.reset(); // Clear the form
    } catch (error) {
        showNotification('messageFailed', 'error');
    }
}

function validateForm(formData) {
    let isValid = true;

    // Validate required fields
    Object.entries(formData).forEach(([field, value]) => {
        const input = document.getElementById(field);
        const errorSpan = input.parentElement.querySelector('.error-message');
        
        if (!value.trim()) {
            isValid = false;
            showInputError(input, translations[currentLanguage]['requiredField']);
        } else if (field === 'email' && !isValidEmail(value)) {
            isValid = false;
            showInputError(input, translations[currentLanguage]['invalidEmail']);
        } else {
            hideInputError(input);
        }
    });

    return isValid;
}

function showInputError(input, message) {
    input.classList.add('error');
    let errorSpan = input.parentElement.querySelector('.error-message');
    if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        input.parentElement.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
}

function hideInputError(input) {
    input.classList.remove('error');
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.remove();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Mock API call - will be replaced with real backend call
function mockContactAPI(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data:', formData);
            resolve({ success: true });
        }, 1000);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initializeFormValidation();
    initializePhoneMask();
});

function initializeFormValidation() {
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm(this)) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    if (typeof window.openModal === 'function') {
                        window.openModal();
                    }

                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });

        const inputs = projectForm.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });
        });
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    const agreement = form.querySelector('input[name="agreement"]');
    if (agreement && !agreement.checked) {
        showError(agreement, 'Необходимо согласие с обработкой данных');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Введите корректный email адрес');
            return false;
        }
    }

    if (field.hasAttribute('required') && !value) {
        showError(field, 'Это поле обязательно для заполнения');
        return false;
    }

    if (field.hasAttribute('minlength') && value.length < field.getAttribute('minlength')) {
        showError(field, `Минимальная длина: ${field.getAttribute('minlength')} символов`);
        return false;
    }

    clearError(field);
    return true;
}

function showError(field, message) {
    clearError(field);
    field.style.borderColor = '#ff4444';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
}

function clearError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function initializePhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }
}
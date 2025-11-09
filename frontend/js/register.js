document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const errorContainer = document.getElementById('errorContainer');

    if (api.isAuthenticated()) {
        window.location.href = 'profile.html';
        return;
    }

    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    };

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorContainer.style.display = 'none';

        const formData = new FormData(registerForm);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName')
        };

        try {
            await api.register(userData);
            window.location.href = 'profile.html';
        } catch (error) {
            showError(api.handleError(error, 'Registration failed'));
        }
    });
});

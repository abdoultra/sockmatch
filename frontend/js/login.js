document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorContainer = document.getElementById('errorContainer');

    if (api.isAuthenticated()) {
        window.history.pushState({}, '', 'profile.html');
        window.history.go();
        return;
    }

    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        errorContainer.classList.add('d-block');
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        errorContainer.classList.add('d-none');

        const formData = new FormData(loginForm);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            await api.login(credentials);
            window.history.pushState({}, '', 'profile.html');
            window.history.go();
        } catch (error) {
            showError(api.handleError(error, 'Login failed'));
            submitButton.disabled = false;
        }
    });
});

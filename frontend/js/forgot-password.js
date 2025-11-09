document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetSpinner = document.getElementById('resetSpinner');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'profile.html';
    }

    const setLoading = (loading) => {
        resetSpinner.style.display = loading ? 'block' : 'none';
        Array.from(forgotPasswordForm.elements).forEach(element => {
            element.disabled = loading;
        });
    };

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = forgotPasswordForm.email.value;

        try {
            setLoading(true);
            await Api.forgotPassword(email);
            showSuccess('Request processed successfully');
            // Store email and redirect to reset password page
            sessionStorage.setItem('resetEmail', email);
            setTimeout(() => {
                window.location.href = 'reset-password.html';
            }, 1000);
        } catch (error) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    });
});

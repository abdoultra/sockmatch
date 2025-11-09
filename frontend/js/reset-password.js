document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const resetSpinner = document.getElementById('resetSpinner');

    // Check if we have a reset email
    const resetEmail = sessionStorage.getItem('resetEmail');
    if (!resetEmail) {
        window.location.href = 'forgot-password.html';
        return;
    }

    const setLoading = (loading) => {
        resetSpinner.style.display = loading ? 'block' : 'none';
        Array.from(resetPasswordForm.elements).forEach(element => {
            element.disabled = loading;
        });
    };

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = resetPasswordForm.newPassword.value;
        const confirmPassword = resetPasswordForm.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await Api.resetPassword(resetEmail, newPassword);
            showSuccess('Password has been reset successfully');

            // Clear reset email and redirect to login page
            sessionStorage.removeItem('resetEmail');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } catch (error) {
            showError(error.message);
            setLoading(false);
        }
    });
});

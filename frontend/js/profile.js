document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const deleteForm = document.getElementById('deleteForm');
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const logoutButton = document.getElementById('logoutButton');
    const errorContainer = document.getElementById('errorContainer');
    const successContainer = document.getElementById('successContainer');

    if (!api.isAuthenticated()) {
        window.history.pushState({}, '', 'login.html');
        window.history.go();
        return;
    }


    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        errorContainer.classList.add('d-block');
        successContainer.classList.add('d-none');
    };

    const showSuccess = (message) => {
        successContainer.textContent = message;
        successContainer.classList.remove('d-none');
        successContainer.classList.add('d-block');
        errorContainer.classList.add('d-none');
    };

    // Validate user data
    const validateUserData = (user) => {
        if (!user || typeof user !== 'object') {
            throw new Error('Invalid user data received');
        }
        if (!Number.isInteger(user.id)) {
            throw new Error('Invalid user ID format');
        }
        return user;
    };

    // Load profile data
    const loadProfile = async () => {
        try {
            const response = await api.getProfile();
            const user = validateUserData(response.data.user);

            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');

            firstNameInput.value = user.firstName || '';
            lastNameInput.value = user.lastName || '';

            firstNameInput.placeholder = user.firstName || 'Enter your first name';
            lastNameInput.placeholder = user.lastName || 'Enter your last name';
        } catch (error) {
            showError(api.handleError(error, 'Failed to load profile'));
        }
    };

    // Handle profile update
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        errorContainer.classList.add('d-none');
        successContainer.classList.add('d-none');

        const formData = new FormData(profileForm);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName')
        };

        try {
            await api.updateProfile(userData);
            showSuccess('Profile updated successfully');
            submitButton.disabled = false;
        } catch (error) {
            if (error.status === 403) {
                showError('You do not have permission to perform this action.');
                return;
            }
            showError(api.handleError(error, 'Failed to update profile'));
            submitButton.disabled = false;
        }
    });

    // Handle account deletion
    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        errorContainer.classList.add('d-none');
        successContainer.classList.add('d-none');

        try {
            await api.deleteProfile();
            api.logout();
            window.history.pushState({}, '', 'login.html');
            window.history.go();
        } catch (error) {
            if (error.status === 403) {
                showError('You do not have permission to perform this action.');
                submitButton.disabled = false;
                return;
            }
            showError(api.handleError(error, 'Failed to delete account'));
            submitButton.disabled = false;
            deleteModal.hide();
        }
    });

    // Modal controls
    deleteAccountButton.addEventListener('click', () => {
        deleteModal.show();
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.hide();
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        api.logout();
        window.history.pushState({}, '', 'login.html');
        window.history.go();
    });

    // Load initial profile data
    loadProfile();
});

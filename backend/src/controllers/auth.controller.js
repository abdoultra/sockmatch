const authService = require('../services/auth.service');
const { validatePassword } = require('../utils/password');
const { createValidationError } = require('../middleware/error');

const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check required fields
        if (!email || !password) {
            throw createValidationError('Email and password are required');
        }

        // Validate password strength
        try {
            validatePassword(password);
        } catch (error) {
            throw createValidationError(error.message);
        }

        const result = await authService.register({
            email,
            password,
            firstName,
            lastName
        });

        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                token: result.token,
                user: result.user
            }
        });
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            next(createValidationError('Email already registered'));
        } else {
            next(error);
        }
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        res.json({
            status: 'success',
            data: {
                token: result.token,
                userId: result.userId
            }
        });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.requestPasswordReset(req.body.email);

        res.json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        // Validate new password strength
        try {
            validatePassword(req.body.newPassword);
        } catch (error) {
            throw createValidationError(error.message);
        }

        const result = await authService.resetPassword(
            req.body.email,
            req.body.newPassword
        );

        res.json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};

const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth');
const { validateId } = require('../middleware/validation');

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('currentPassword').optional().notEmpty(),
    body('newPassword').optional().isLength({ min: 6 }).custom((value, { req }) => {
        if (value && !req.body.currentPassword) {
            throw new Error('Current password is required to set new password');
        }
        return true;
    })
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, userController.updateProfile);
router.delete('/account', userController.deleteProfile);

// Admin routes for user management
router.get('/:id', validateId, userController.getUser);
router.put('/:id', validateId, updateProfileValidation, userController.updateUser);
router.delete('/:id', validateId, userController.deleteUser);
router.get('/', userController.listUsers);

module.exports = router;

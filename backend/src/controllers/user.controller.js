const userService = require('../services/user.service');
const { createNotFoundError } = require('../middleware/error');

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);

        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.user.id, req.body);

        res.json({
            status: 'success',
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        });
    } catch (error) {
        next(error);
    }
};

const deleteProfile = async (req, res, next) => {
    try {
        await userService.deleteUser(req.user.id);

        res.json({
            status: 'success',
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.validatedId);
        if (!user) {
            throw createNotFoundError('User not found');
        }

        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

const listUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        const result = await userService.listUsers({
            skip,
            take: parseInt(limit),
            search
        });

        res.json({
            status: 'success',
            data: {
                users: result.users,
                pagination: {
                    total: result.pagination.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(result.pagination.total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.validatedId, req.body);

        res.json({
            status: 'success',
            message: 'User updated successfully',
            data: { user: updatedUser }
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.validatedId);

        res.json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    getUser,
    listUsers,
    updateUser,
    deleteUser
};

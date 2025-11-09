const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get user by ID
const getUserById = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    // Convert to integer if it's a string
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    if (isNaN(id)) {
        throw new Error('Invalid user ID format');
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

// Update user
const updateUser = async (userId, userData) => {
    const { firstName, lastName, email } = userData;

    // If email is being updated, check if it's already taken
    if (email) {
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                id: { not: userId }
            }
        });

        if (existingUser) {
            throw new Error('Email already in use');
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(email !== undefined && { email })
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return updatedUser;
};

// Delete user
const deleteUser = async (userId) => {
    await prisma.user.delete({
        where: { id: userId }
    });

    return { message: 'User deleted successfully' };
};

// List users with pagination and search
const listUsers = async (options = {}) => {
    const {
        where = {},
        select = {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy = { createdAt: 'desc' },
        skip = 0,
        take = 10,
        search = ''
    } = options;

    const searchWhere = search
        ? {
            OR: [
                { email: { contains: search } },
                { firstName: { contains: search } },
                { lastName: { contains: search } }
            ]
        }
        : {};

    const finalWhere = { ...where, ...searchWhere };

    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            where: finalWhere,
            select,
            orderBy,
            skip,
            take
        }),
        prisma.user.count({ where: finalWhere })
    ]);

    return {
        users,
        pagination: {
            total,
            skip,
            take
        }
    };
};

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
    listUsers
};

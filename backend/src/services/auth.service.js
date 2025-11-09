const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { createToken } = require('../middleware/auth');

const prisma = new PrismaClient();

const register = async (userData) => {
    const { email, password, firstName, lastName } = userData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with explicit field selection
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName
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

    // Create token with explicit user ID
    const token = createToken({ userId: user.id });

    return { user, token };
};

const login = async (credentials) => {
    const { email, password } = credentials;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Invalid credentials');
    }

    // Create token
    const token = createToken({ userId: user.id });

    return { token, userId: user.id };
};

const requestPasswordReset = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // We still return success to prevent email enumeration
        return { message: 'If this email exists, a reset link has been sent' };
    }

    // Here you would typically:
    // 1. Generate a reset token
    // 2. Save it to the database
    // 3. Send an email with the reset link

    return { message: 'If this email exists, a reset link has been sent' };
};

const resetPassword = async (email, newPassword) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    return { message: 'Password reset successful' };
};

module.exports = {
    register,
    login,
    requestPasswordReset,
    resetPassword
};

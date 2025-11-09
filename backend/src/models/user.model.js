const { PrismaClient } = require('@prisma/client');

class UserModel {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(userData) {
        return await this.prisma.user.create({
            data: userData
        });
    }

    async findById(id, select = null) {
        return await this.prisma.user.findUnique({
            where: { id },
            ...(select && { select })
        });
    }

    async findByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email }
        });
    }

    async update(id, data) {
        return await this.prisma.user.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await this.prisma.user.delete({
            where: { id }
        });
    }

    async findMany(options = {}) {
        const {
            where = {},
            select = null,
            orderBy = { createdAt: 'desc' },
            skip = 0,
            take = 10
        } = options;

        return await this.prisma.user.findMany({
            where,
            ...(select && { select }),
            orderBy,
            skip,
            take
        });
    }

    async count(where = {}) {
        return await this.prisma.user.count({ where });
    }

    // Transaction support
    async transaction(operations) {
        return await this.prisma.$transaction(operations);
    }

    // Custom queries
    async findByEmailNotId(email, id) {
        return await this.prisma.user.findFirst({
            where: {
                email,
                id: { not: id }
            }
        });
    }

    // Utility method to get safe user data (excluding password)
    static getSafeUserSelect() {
        return {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true
        };
    }
}

module.exports = new UserModel();

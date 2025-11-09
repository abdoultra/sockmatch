const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { cors: corsConfig } = require('./config/config');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const { handleError } = require('./middleware/error');
const { validateId } = require('./middleware/validation');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(express.json());

// Routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Global error handling middleware (must be after routes)
app.use(handleError);

// Database connection and server startup
const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Connected to database successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error connecting to database:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await prisma.$disconnect();
    process.exit(0);
});

module.exports = app; // Export for testing

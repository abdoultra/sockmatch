module.exports = {
    cors: {
        origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],  // Frontend URLs
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        exposedHeaders: ['Set-Cookie'],
        optionsSuccessStatus: 200
    },
    jwt: {
        secret: 'sockmatch-secret-key-2025',  // This should be in env variables in production
        expiresIn: '24h'
    }
};

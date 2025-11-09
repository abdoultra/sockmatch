const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/config');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const { userId } = jwt.verify(token, jwtConfig.secret);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token format' });
        }
        req.user = { id: userId };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const createToken = (payload) => {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

module.exports = {
    authMiddleware,
    createToken
};

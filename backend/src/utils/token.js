const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';
const RESET_TOKEN_EXPIRY = '1h';

const createToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        throw new Error('Invalid token format');
    }
};

const createResetToken = (userId) => {
    return jwt.sign(
        { userId, purpose: 'reset' },
        JWT_SECRET,
        { expiresIn: RESET_TOKEN_EXPIRY }
    );
};

const verifyResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.purpose !== 'reset') {
            throw new Error('Invalid token purpose');
        }
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired reset token');
    }
};

module.exports = {
    createToken,
    verifyToken,
    decodeToken,
    createResetToken,
    verifyResetToken
};

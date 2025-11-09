const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const validatePassword = (password) => {
    // Password must be at least 8 characters long and contain:
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        throw new Error(
            'Password must be at least 8 characters long and contain at least one uppercase letter, ' +
            'one lowercase letter, one number, and one special character'
        );
    }

    return true;
};

module.exports = {
    hashPassword,
    comparePasswords,
    validatePassword
};

const validateId = (req, res, next) => {
    // Get ID from params or user object (for profile routes)
    const id = req.params.id || (req.user && req.user.id);

    if (!id) {
        return res.status(400).json({
            status: 'error',
            message: 'ID parameter is required'
        });
    }

    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid ID format'
        });
    }

    // Store the parsed ID for use in controllers
    req.validatedId = parsedId;
    next();
};

module.exports = {
    validateId
};

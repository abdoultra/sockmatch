// Error handler middleware
const handleError = (err, req, res, next) => {
    console.error(err);

    // Default error
    let status = 500;
    let message = 'Internal Server Error';
    let errors = null;

    // Handle different types of errors based on their name
    switch (err.name) {
        case 'ValidationError':
            status = 400;
            message = err.message || 'Validation Error';
            errors = err.errors;
            break;
        case 'UnauthorizedError':
            status = 401;
            message = err.message || 'Unauthorized';
            break;
        case 'ForbiddenError':
            status = 403;
            message = err.message || 'Forbidden';
            break;
        case 'NotFoundError':
            status = 404;
            message = err.message || 'Resource Not Found';
            break;
    }

    // If it's a custom error with status
    if (err.status) {
        status = err.status;
    }

    // If it's a custom error with specific message
    if (err.message && err.message !== 'Internal Server Error') {
        message = err.message;
    }

    // Prepare response
    const errorResponse = {
        status: 'error',
        message
    };

    // Add errors array if validation errors exist
    if (errors) {
        errorResponse.errors = errors;
    }

    // Add error details in development environment
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        if (err.details) {
            errorResponse.details = err.details;
        }
    }

    res.status(status).json(errorResponse);
};

// Error creators
const createError = (message, status = 500, details = null) => {
    const error = new Error(message);
    error.status = status;
    error.details = details;
    return error;
};

const createValidationError = (message = 'Validation Error', details = null) => {
    const error = createError(message, 400, details);
    error.name = 'ValidationError';
    return error;
};

const createUnauthorizedError = (message = 'Unauthorized') => {
    const error = createError(message, 401);
    error.name = 'UnauthorizedError';
    return error;
};

const createForbiddenError = (message = 'Forbidden') => {
    const error = createError(message, 403);
    error.name = 'ForbiddenError';
    return error;
};

const createNotFoundError = (message = 'Resource Not Found') => {
    const error = createError(message, 404);
    error.name = 'NotFoundError';
    return error;
};

module.exports = {
    handleError,
    createError,
    createValidationError,
    createUnauthorizedError,
    createForbiddenError,
    createNotFoundError
};

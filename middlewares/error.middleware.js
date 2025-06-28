const errorMiddleware = (err, req, res, next) => {
    console.error('❌ Error caught:', err);

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error';

    // ✅ Handle Mongo duplicate key error (E11000)
    if (err.code === 11000 || err.message.includes('E11000')) {
        const duplicateField =
            err.keyValue
                ? Object.keys(err.keyValue).join(', ')
                : (err.message.match(/dup key.*\{ (.*?) \}/)?.[1] || 'unknown');

        message = `Duplicate entry for: ${duplicateField}`;
        statusCode = 400;
    }

    // ✅ Handle Mongoose validation errors
    else if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    // ✅ Handle bad ObjectId casting
    else if (err.name === 'CastError') {
        message = `Invalid value for field: ${err.path}`;
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default errorMiddleware;

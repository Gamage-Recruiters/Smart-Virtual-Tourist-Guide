const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()} -`, err.message);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate entry found.' });
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    // Default server error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;

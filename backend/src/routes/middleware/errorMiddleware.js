// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : null, // error set to empty object, type error changes depending on environment due to this reason
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // stack trace in only one environment
    });
};
module.exports = errorHandler
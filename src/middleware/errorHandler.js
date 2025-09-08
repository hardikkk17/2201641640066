function errorHandler(err, req, res, next) {
    res.status(err.status || 400).json({ error: err.message });
}
module.exports = errorHandler;

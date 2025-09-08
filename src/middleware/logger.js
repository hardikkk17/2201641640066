function logger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${Date.now() - start}ms)`;
    });
    next();
}
module.exports = logger;

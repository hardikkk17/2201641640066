const { urls } = require('../models/store');
const { generateShortcode } = require('../utils/generator');
const { validURL } = require('../utils/validator');

function createShortUrl(req, res, next) {
    const { url, validity = 30, shortcode } = req.body;
    if (!url || !validURL(url)) return next({ message: 'Invalid URL', status: 400 });
    let code = shortcode && /^[a-zA-Z0-9]{4,12}$/.test(shortcode) ? shortcode : generateShortcode();
    if (urls[code]) code = generateShortcode();
    const now = new Date();
    const expiry = new Date(now.getTime() + validity * 60000).toISOString();
    urls[code] = {
        url, shortcode: code, createdAt: now.toISOString(), expiry, clicks: []
    };
    res.status(201).json({ shortLink: `http://localhost:3000/${code}`, expiry });
}

function redirectShortUrl(req, res, next) {
    const { shortcode } = req.params;
    const entry = urls[shortcode];
    if (!entry) return next({ message: 'Shortcode not found', status: 404 });
    if (new Date() > new Date(entry.expiry)) return next({ message: 'Shortcode expired', status: 410 });
    entry.clicks.push({ timestamp: new Date().toISOString(), referrer: req.get('referer') || '', location: 'IN' });
    res.redirect(entry.url);
}

function getStats(req, res, next) {
    const { shortcode } = req.params;
    const entry = urls[shortcode];
    if (!entry) return next({ message: 'Shortcode not found', status: 404 });
    res.json({
        url: entry.url,
        shortcode: entry.shortcode,
        createdAt: entry.createdAt,
        expiry: entry.expiry,
        clickCount: entry.clicks.length,
        clicks: entry.clicks
    });
}

module.exports = { createShortUrl, redirectShortUrl, getStats };

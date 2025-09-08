function validURL(str) {
    try { new URL(str); return true; } catch (_) { return false; }
}
module.exports = { validURL };

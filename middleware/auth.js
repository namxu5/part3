function isJsonRequest(req) {
  const contentType = (req.headers['content-type'] || '').trim().toLowerCase();
  const accept = (req.headers['accept'] || '').trim().toLowerCase();
  const xrw = (req.headers['x-requested-with'] || '').trim().toLowerCase();
  return contentType.startsWith('application/json') || accept.includes('application/json') || xrw === 'xmlhttprequest';
}

module.exports = function(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  if (isJsonRequest(req)) {
    return res.status(401).json({ success: false, message: 'Bạn chưa đăng nhập hoặc phiên đã hết hạn.' });
  }
  res.redirect('/auth/login');
};

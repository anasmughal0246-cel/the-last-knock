module.exports = {
  secret: process.env.JWT_SECRET || 'fallback_secret',
  expire: process.env.JWT_EXPIRE || '7d',
};
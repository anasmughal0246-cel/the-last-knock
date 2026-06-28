const ADMIN_EMAIL = 'anasmughal0246@gmail.com';

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error('Not authorized'));
  }
  if (req.user.email !== ADMIN_EMAIL) {
    res.status(403);
    return next(new Error('Access denied. Admin only.'));
  }
  next();
};

module.exports = adminMiddleware;
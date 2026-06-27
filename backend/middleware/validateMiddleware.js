// Sanitize string — trim and limit length
const sanitizeStr = (val, maxLen = 500) =>
  typeof val === 'string' ? val.trim().slice(0, maxLen) : val;

// Validate register input
const validateRegister = (req, res, next) => {
  let { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields required' });

  username = sanitizeStr(username, 30);
  email    = sanitizeStr(email, 100).toLowerCase();
  password = sanitizeStr(password, 128);

  if (username.length < 2)
    return res.status(400).json({ success: false, message: 'Username must be at least 2 characters' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, message: 'Invalid email format' });

  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

  req.body = { username, email, password };
  next();
};

// Validate login input
const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  email    = sanitizeStr(email, 100).toLowerCase();
  password = sanitizeStr(password, 128);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, message: 'Invalid email format' });

  req.body = { email, password };
  next();
};

module.exports = { validateRegister, validateLogin };
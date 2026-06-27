require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const helmet   = require('helmet');
const path     = require('path');
const fs       = require('fs');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter }   = require('./middleware/rateLimitMiddleware');

const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.use('/api/auth',         require('./routes/authRoutes'));
// Email verification redirect
app.get('/verify-email', (req, res) => {
  const token = req.query.token;
  res.redirect(`/api/auth/verify-email?token=${token}`);
});
app.use('/api/chapters',     require('./routes/chapterRoutes'));
app.use('/api/progress',     require('./routes/progressRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/endings',      require('./routes/endingRoutes'));
app.use('/api/profile',      require('./routes/profileRoutes'));

app.use(express.static(path.join(__dirname, '../frontend')));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const filePath = path.join(__dirname, '../frontend', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use(errorHandler);
module.exports = app;
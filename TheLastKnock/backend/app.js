require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
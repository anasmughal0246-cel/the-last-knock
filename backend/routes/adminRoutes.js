const express = require('express');
const router  = express.Router();
const { protect }    = require('../middleware/authMiddleware');
const { adminOnly }  = require('../middleware/adminMiddleware');
const {
  getStats, getChapters, getChapter,
  createChapter, updateChapter, deleteChapter,
  getUsers, makeAdmin
} = require('../controllers/adminController');

router.use(protect, adminOnly); // all routes need auth + admin

router.get('/stats',              getStats);
router.get('/chapters',           getChapters);
router.get('/chapters/:id',       getChapter);
router.post('/chapters',          createChapter);
router.put('/chapters/:id',       updateChapter);
router.delete('/chapters/:id',    deleteChapter);
router.get('/users',              getUsers);
router.put('/users/:id/makeadmin',makeAdmin);

module.exports = router;
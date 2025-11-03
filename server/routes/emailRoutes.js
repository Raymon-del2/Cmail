const express = require('express');
const router = express.Router();
const {
  sendEmail,
  getInbox,
  getSent,
  getStarred,
  getEmail,
  toggleStar,
  markAsRead,
  deleteEmail,
  saveDraft,
  getDrafts,
  getTrash,
  getSnoozed,
  getImportant,
  getScheduled,
  getAllMail,
  getSpam,
  toggleImportant,
  getEmailsByLabel,
  addLabel,
  removeLabel,
  getEmailStorage
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Email operations
router.get('/storage', getEmailStorage);
router.post('/send', sendEmail);
router.get('/inbox', getInbox);
router.get('/sent', getSent);
router.get('/starred', getStarred);
router.get('/drafts', getDrafts);
router.get('/trash', getTrash);
router.get('/snoozed', getSnoozed);
router.get('/important', getImportant);
router.get('/scheduled', getScheduled);
router.get('/all', getAllMail);
router.get('/spam', getSpam);
router.get('/label/:label', getEmailsByLabel);
router.get('/:id', getEmail);

// Email actions
router.patch('/:id/star', toggleStar);
router.patch('/:id/important', toggleImportant);
router.patch('/:id/read', markAsRead);
router.patch('/:id/label/add', addLabel);
router.patch('/:id/label/remove', removeLabel);
router.delete('/:id', deleteEmail);
router.post('/draft', saveDraft);

module.exports = router;

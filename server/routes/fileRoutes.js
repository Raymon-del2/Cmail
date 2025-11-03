const express = require('express');
const router = express.Router();
const {
  getFiles,
  uploadFile,
  uploadAttachment,
  deleteFile,
  getFile,
  renameFile,
  getStorageUsage
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// File operations
router.get('/storage', getStorageUsage);
router.post('/upload', upload.single('file'), uploadAttachment); // General upload for attachments
router.get('/label/:labelId', getFiles);
router.post('/label/:labelId', upload.single('file'), uploadFile);
router.get('/:fileId', getFile);
router.patch('/:fileId/rename', renameFile);
router.delete('/:fileId', deleteFile);

module.exports = router;

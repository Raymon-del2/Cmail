const express = require('express');
const router = express.Router();
const {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel
} = require('../controllers/labelController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Label operations
router.get('/', getLabels);
router.post('/', createLabel);
router.patch('/:labelId', updateLabel);
router.delete('/:labelId', deleteLabel);

module.exports = router;

const File = require('../models/File');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Get all files for a label
exports.getFiles = async (req, res) => {
  try {
    const { labelId } = req.params;
    
    // Verify label belongs to user
    const user = await User.findById(req.user.id);
    const label = user.labels.id(labelId);
    
    if (!label) {
      return res.status(404).json({
        success: false,
        message: 'Label not found'
      });
    }

    const files = await File.find({ 
      labelId,
      userId: req.user.id 
    }).sort({ createdAt: -1 });

    // Add URLs to files
    const filesWithUrls = files.map(file => ({
      ...file.toObject(),
      url: `/uploads/${file.path}`
    }));

    res.status(200).json({
      success: true,
      files: filesWithUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files',
      error: error.message
    });
  }
};

// Upload a file for email attachments (general upload)
exports.uploadAttachment = async (req, res) => {
  try {
    console.log('Attachment upload request received');

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('File uploaded:', req.file);

    // Verify user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) fileType = 'document';

    // Create file record with relative path
    const relativePath = req.file.path.replace(/\\/g, '/').split('uploads/')[1];
    console.log('Creating attachment file record with path:', relativePath);
    
    const file = await File.create({
      name: req.file.filename,
      originalName: req.file.originalname,
      type: fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: relativePath,
      userId: req.user.id,
      isAttachment: true // Mark as attachment
    });

    console.log('Attachment file created successfully:', file._id);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        name: file.originalName,
        size: file.size,
        type: file.mimeType,
        url: `/uploads/${relativePath}`
      }
    });
  } catch (error) {
    console.error('Attachment upload error:', error);
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// Upload a file (with multer)
exports.uploadFile = async (req, res) => {
  try {
    console.log('Upload request received for labelId:', req.params.labelId);
    const { labelId } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('File uploaded:', req.file);

    // Verify label belongs to user
    const user = await User.findById(req.user.id);
    if (!user) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const label = user.labels.id(labelId);
    
    if (!label) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Label not found'
      });
    }

    console.log('Label found:', label.name);

    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) fileType = 'document';

    // Create file record with relative path
    const relativePath = req.file.path.replace(/\\/g, '/').split('uploads/')[1];
    console.log('Creating file record with path:', relativePath);
    
    const file = await File.create({
      name: req.file.filename,
      originalName: req.file.originalname,
      type: fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: relativePath, // Store relative path from uploads directory
      labelId,
      userId: req.user.id
    });

    console.log('File created successfully:', file._id);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        ...file.toObject(),
        url: `/uploads/${relativePath}` // Add URL for easy access
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// Get total storage used by user's files
exports.getStorageUsage = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id });
    
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    
    res.json({
      success: true,
      totalSize,
      fileCount: files.length,
      formattedSize: formatBytes(totalSize)
    });
  } catch (error) {
    console.error('Get storage usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get storage usage'
    });
  }
};

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Rename a file
exports.renameFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { newName } = req.body;

    if (!newName || !newName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'New file name is required'
      });
    }

    const file = await File.findOne({
      _id: fileId,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    file.originalName = newName.trim();
    await file.save();

    res.status(200).json({
      success: true,
      message: 'File renamed successfully',
      file: {
        ...file.toObject(),
        url: `/uploads/${file.path}`
      }
    });
  } catch (error) {
    console.error('Rename file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rename file',
      error: error.message
    });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({
      _id: fileId,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete database record
    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};

// Get a single file
exports.getFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({
      _id: fileId,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(200).json({
      success: true,
      file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file',
      error: error.message
    });
  }
};

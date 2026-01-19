const File = require('../models/File');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { saveFileToTurso, getFileFromTurso, getFilesByLabel, deleteFileFromTurso, getStorageUsage } = require('../utils/tursoFiles');

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

    const files = await getFilesByLabel(labelId, req.user.id);

    // Add URLs to files
    const filesWithUrls = files.map(file => ({
      ...file,
      url: `/api/files/${file.id}/data`
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

    // Convert file to base64
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Data = fileBuffer.toString('base64');

    // Delete local file after converting to base64
    fs.unlinkSync(req.file.path);

    // Save to Turso
    const fileId = await saveFileToTurso({
      name: req.file.filename,
      originalName: req.file.originalname,
      type: fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      base64Data,
      userId: req.user.id,
      isAttachment: true
    });

    console.log('Attachment file created successfully:', fileId);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: fileId,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        url: `/api/files/${fileId}/data`
      }
    });
  } catch (error) {
    console.error('Attachment upload error:', error);
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
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

    // Convert file to base64
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Data = fileBuffer.toString('base64');

    // Delete local file after converting to base64
    fs.unlinkSync(req.file.path);

    // Save to Turso
    const fileId = await saveFileToTurso({
      name: req.file.filename,
      originalName: req.file.originalname,
      type: fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      base64Data,
      userId: req.user.id,
      labelId
    });

    console.log('File created successfully:', fileId);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: fileId,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimeType,
        url: `/api/files/${fileId}/data`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
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
    const usage = await getStorageUsage(req.user.id);
    
    res.json({
      success: true,
      totalSize: usage.totalSize,
      fileCount: usage.fileCount,
      formattedSize: formatBytes(usage.totalSize)
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

    // Delete from Turso
    await deleteFileFromTurso(fileId);

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

    const file = await getFileFromTurso(fileId);

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

// Get file data (serves the actual file content from base64)
exports.getFileData = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await getFileFromTurso(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file.base64Data, 'base64');

    // Set appropriate content type
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);

    // Send the file data
    res.send(buffer);
  } catch (error) {
    console.error('Get file data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file data',
      error: error.message
    });
  }
};

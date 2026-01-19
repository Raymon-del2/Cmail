const turso = require('../config/turso');
const fs = require('fs');

exports.saveFileToTurso = async (fileData) => {
  try {
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const result = await turso.execute({
      sql: `INSERT INTO files (id, name, original_name, type, mime_type, size, base64_data, user_id, label_id, is_attachment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        fileId,
        fileData.name,
        fileData.originalName,
        fileData.type,
        fileData.mimeType,
        fileData.size,
        fileData.base64Data,
        fileData.userId,
        fileData.labelId || null,
        fileData.isAttachment ? 1 : 0
      ]
    });

    return fileId;
  } catch (error) {
    console.error('Error saving file to Turso:', error);
    throw error;
  }
};

exports.getFileFromTurso = async (fileId) => {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM files WHERE id = ?`,
      args: [fileId]
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      originalName: row.original_name,
      type: row.type,
      mimeType: row.mime_type,
      size: row.size,
      base64Data: row.base64_data,
      userId: row.user_id,
      labelId: row.label_id,
      isAttachment: row.is_attachment === 1,
      createdAt: row.created_at
    };
  } catch (error) {
    console.error('Error getting file from Turso:', error);
    throw error;
  }
};

exports.getFilesByUser = async (userId) => {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC`,
      args: [userId]
    });

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      originalName: row.original_name,
      type: row.type,
      mimeType: row.mime_type,
      size: row.size,
      base64Data: row.base64_data,
      userId: row.user_id,
      labelId: row.label_id,
      isAttachment: row.is_attachment === 1,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error getting files from Turso:', error);
    throw error;
  }
};

exports.getFilesByLabel = async (labelId, userId) => {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM files WHERE label_id = ? AND user_id = ? ORDER BY created_at DESC`,
      args: [labelId, userId]
    });

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      originalName: row.original_name,
      type: row.type,
      mimeType: row.mime_type,
      size: row.size,
      base64Data: row.base64_data,
      userId: row.user_id,
      labelId: row.label_id,
      isAttachment: row.is_attachment === 1,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error getting files from Turso:', error);
    throw error;
  }
};

exports.deleteFileFromTurso = async (fileId) => {
  try {
    await turso.execute({
      sql: `DELETE FROM files WHERE id = ?`,
      args: [fileId]
    });
    return true;
  } catch (error) {
    console.error('Error deleting file from Turso:', error);
    throw error;
  }
};

exports.getStorageUsage = async (userId) => {
  try {
    const result = await turso.execute({
      sql: `SELECT SUM(size) as total_size, COUNT(*) as file_count FROM files WHERE user_id = ?`,
      args: [userId]
    });

    const row = result.rows[0];
    return {
      totalSize: row.total_size || 0,
      fileCount: row.file_count || 0
    };
  } catch (error) {
    console.error('Error getting storage usage from Turso:', error);
    throw error;
  }
};

const turso = require('../config/turso');

exports.saveEmailToTurso = async (emailData) => {
  try {
    const emailId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const result = await turso.execute({
      sql: `INSERT INTO emails (id, sender_id, sender_email, sender_name, recipient_email, recipient_name, subject, body, attachment_ids, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        emailId,
        emailData.senderId,
        emailData.senderEmail,
        emailData.senderName,
        emailData.recipientEmail,
        emailData.recipientName || null,
        emailData.subject,
        emailData.body,
        emailData.attachmentIds ? emailData.attachmentIds.join(',') : null,
        emailData.status || 'sent'
      ]
    });

    return emailId;
  } catch (error) {
    console.error('Error saving email to Turso:', error);
    throw error;
  }
};

exports.getEmailFromTurso = async (emailId) => {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM emails WHERE id = ?`,
      args: [emailId]
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      senderId: row.sender_id,
      senderEmail: row.sender_email,
      senderName: row.sender_name,
      recipientEmail: row.recipient_email,
      recipientName: row.recipient_name,
      subject: row.subject,
      body: row.body,
      attachmentIds: row.attachment_ids ? row.attachment_ids.split(',') : [],
      status: row.status,
      createdAt: row.created_at
    };
  } catch (error) {
    console.error('Error getting email from Turso:', error);
    throw error;
  }
};

exports.getEmailsBySender = async (senderId) => {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM emails WHERE sender_id = ? ORDER BY created_at DESC`,
      args: [senderId]
    });

    return result.rows.map(row => ({
      id: row.id,
      senderId: row.sender_id,
      senderEmail: row.sender_email,
      senderName: row.sender_name,
      recipientEmail: row.recipient_email,
      recipientName: row.recipient_name,
      subject: row.subject,
      body: row.body,
      attachmentIds: row.attachment_ids ? row.attachment_ids.split(',') : [],
      status: row.status,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error getting emails from Turso:', error);
    throw error;
  }
};

exports.getEmailsByRecipient = async (recipientEmail) => {
  try {
    const result = await turso.execute({
      sql: `SELECT * FROM emails WHERE recipient_email = ? ORDER BY created_at DESC`,
      args: [recipientEmail]
    });

    return result.rows.map(row => ({
      id: row.id,
      senderId: row.sender_id,
      senderEmail: row.sender_email,
      senderName: row.sender_name,
      recipientEmail: row.recipient_email,
      recipientName: row.recipient_name,
      subject: row.subject,
      body: row.body,
      attachmentIds: row.attachment_ids ? row.attachment_ids.split(',') : [],
      status: row.status,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Error getting emails from Turso:', error);
    throw error;
  }
};

exports.deleteEmailFromTurso = async (emailId) => {
  try {
    await turso.execute({
      sql: `DELETE FROM emails WHERE id = ?`,
      args: [emailId]
    });
    return true;
  } catch (error) {
    console.error('Error deleting email from Turso:', error);
    throw error;
  }
};

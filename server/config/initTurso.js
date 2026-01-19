const turso = require('../config/turso');

async function initTursoDB() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        original_name TEXT NOT NULL,
        type TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        base64_data TEXT NOT NULL,
        user_id TEXT NOT NULL,
        label_id TEXT,
        is_attachment INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS emails (
        id TEXT PRIMARY KEY,
        sender_id TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        recipient_email TEXT NOT NULL,
        recipient_name TEXT,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        attachment_ids TEXT,
        status TEXT DEFAULT 'sent',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Turso database initialized successfully');
  } catch (error) {
    console.error('❌ Turso database initialization error:', error);
  }
}

module.exports = initTursoDB;

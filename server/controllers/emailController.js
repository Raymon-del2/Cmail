const Email = require('../models/Email');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Send email
exports.sendEmail = async (req, res) => {
  try {
    const { to, cc, bcc, subject, body } = req.body;

    // Create email in database
    const email = await Email.create({
      from: req.user._id,
      to: Array.isArray(to) ? to : [to],
      cc: cc || [],
      bcc: bcc || [],
      subject,
      body,
      isDraft: false
    });

    // Populate sender info
    await email.populate('from', 'firstName lastName email');

    // Send notification email to recipients
    const recipients = [...email.to, ...email.cc];
    for (const recipient of recipients) {
      try {
        await sendEmail({
          to: recipient,
          subject: `New email from ${email.from.firstName} ${email.from.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #8b5cf6;">New Email from C-mail</h2>
              <p><strong>From:</strong> ${email.from.firstName} ${email.from.lastName} (${email.from.email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                ${body}
              </div>
              <p style="color: #666; font-size: 12px;">
                This email was sent via C-mail. 
                <a href="${process.env.CLIENT_URL}/inbox" style="color: #8b5cf6;">View in C-mail</a>
              </p>
            </div>
          `
        });
      } catch (emailError) {
        console.error(`Failed to send notification to ${recipient}:`, emailError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Email sent successfully',
      email
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
};

// Get inbox emails
exports.getInbox = async (req, res) => {
  try {
    const { category = 'primary', page = 1, limit = 50 } = req.query;

    const query = {
      to: req.user.email,
      isTrashed: false,
      isDraft: false
    };

    if (category) {
      query.category = category;
    }

    const emails = await Email.find(query)
      .populate('from', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Email.countDocuments(query);

    res.json({
      success: true,
      emails,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emails'
    });
  }
};

// Get sent emails
exports.getSent = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const emails = await Email.find({
      from: req.user._id,
      isTrashed: false,
      isDraft: false
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Email.countDocuments({
      from: req.user._id,
      isTrashed: false,
      isDraft: false
    });

    res.json({
      success: true,
      emails,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get sent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sent emails'
    });
  }
};

// Get starred emails
exports.getStarred = async (req, res) => {
  try {
    const emails = await Email.find({
      $or: [
        { from: req.user._id },
        { to: req.user.email }
      ],
      isStarred: true,
      isTrashed: false
    })
      .populate('from', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Get starred error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch starred emails'
    });
  }
};

// Get single email
exports.getEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id)
      .populate('from', 'firstName lastName email');

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    // Check if user has access to this email
    const hasAccess = 
      email.from._id.toString() === req.user._id.toString() ||
      email.to.includes(req.user.email) ||
      email.cc.includes(req.user.email);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Mark as read if recipient
    if (email.to.includes(req.user.email) && !email.isRead) {
      email.isRead = true;
      await email.save();
    }

    res.json({
      success: true,
      email
    });
  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email'
    });
  }
};

// Toggle star
exports.toggleStar = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    email.isStarred = !email.isStarred;
    await email.save();

    res.json({
      success: true,
      message: email.isStarred ? 'Email starred' : 'Email unstarred',
      isStarred: email.isStarred
    });
  } catch (error) {
    console.error('Toggle star error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle star'
    });
  }
};

// Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    email.isRead = true;
    await email.save();

    res.json({
      success: true,
      message: 'Email marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as read'
    });
  }
};

// Get storage usage for emails
exports.getEmailStorage = async (req, res) => {
  try {
    const emails = await Email.find({
      $or: [
        { from: req.user._id },
        { to: req.user.email },
        { cc: req.user.email }
      ]
    });

    // Approximate email size (subject + body + attachments metadata)
    const totalSize = emails.reduce((sum, email) => {
      const subjectSize = (email.subject || '').length;
      const bodySize = (email.body || '').length;
      const attachmentSize = (email.attachments || []).reduce((aSum, att) => aSum + (att.size || 0), 0);
      return sum + subjectSize + bodySize + attachmentSize;
    }, 0);

    res.json({
      success: true,
      totalSize,
      emailCount: emails.length
    });
  } catch (error) {
    console.error('Get email storage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email storage'
    });
  }
};

// Delete email (move to trash or delete permanently)
exports.deleteEmail = async (req, res) => {
  try {
    const { permanent } = req.query;
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    // Check if user has permission to delete
    const hasAccess = 
      email.from.toString() === req.user._id.toString() ||
      email.to.includes(req.user.email) ||
      email.cc.includes(req.user.email);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Permanent deletion
    if (permanent === 'true') {
      await email.deleteOne();
      return res.json({
        success: true,
        message: 'Email permanently deleted'
      });
    }

    // Move to trash
    email.isTrashed = true;
    await email.save();

    res.json({
      success: true,
      message: 'Email moved to trash'
    });
  } catch (error) {
    console.error('Delete email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete email'
    });
  }
};

// Save draft
exports.saveDraft = async (req, res) => {
  try {
    const { to, cc, bcc, subject, body } = req.body;

    const draft = await Email.create({
      from: req.user._id,
      to: Array.isArray(to) ? to : [to],
      cc: cc || [],
      bcc: bcc || [],
      subject: subject || '(No subject)',
      body: body || '',
      isDraft: true
    });

    res.status(201).json({
      success: true,
      message: 'Draft saved',
      draft
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save draft'
    });
  }
};

// Get drafts
exports.getDrafts = async (req, res) => {
  try {
    const drafts = await Email.find({
      from: req.user._id,
      isDraft: true,
      isTrashed: false
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      drafts
    });
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drafts'
    });
  }
};

// Get trash
exports.getTrash = async (req, res) => {
  try {
    const emails = await Email.find({
      $or: [
        { from: req.user._id },
        { to: req.user.email }
      ],
      isTrashed: true
    })
      .populate('from', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Get trash error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trash'
    });
  }
};

// Get snoozed emails
exports.getSnoozed = async (req, res) => {
  try {
    const emails = await Email.find({
      $or: [
        { from: req.user._id },
        { to: req.user.email }
      ],
      isSnoozed: true,
      isTrashed: false
    })
      .populate('from', 'firstName lastName email')
      .sort({ snoozeUntil: 1 });

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Get snoozed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch snoozed emails'
    });
  }
};

// Get important emails
exports.getImportant = async (req, res) => {
  try {
    const emails = await Email.find({
      $or: [
        { from: req.user._id },
        { to: req.user.email }
      ],
      isImportant: true,
      isTrashed: false
    })
      .populate('from', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Get important error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch important emails'
    });
  }
};

// Get scheduled emails
exports.getScheduled = async (req, res) => {
  try {
    const emails = await Email.find({
      from: req.user._id,
      isScheduled: true,
      isTrashed: false
    })
      .sort({ scheduledFor: 1 });

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Get scheduled error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduled emails'
    });
  }
};

// Get all mail
exports.getAllMail = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const emails = await Email.find({
      $or: [
        { from: req.user._id },
        { to: req.user.email }
      ],
      isTrashed: false,
      isDraft: false
    })
      .populate('from', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Email.countDocuments({
      $or: [
        { from: req.user._id },
        { to: req.user.email }
      ],
      isTrashed: false,
      isDraft: false
    });

    res.json({
      success: true,
      emails,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all mail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all mail'
    });
  }
};

// Get spam emails
exports.getSpam = async (req, res) => {
  try {
    const emails = await Email.find({
      to: req.user.email,
      isSpam: true,
      isTrashed: false
    })
      .populate('from', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Get spam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spam emails'
    });
  }
};

// Toggle important
exports.toggleImportant = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    email.isImportant = !email.isImportant;
    await email.save();

    res.json({
      success: true,
      message: email.isImportant ? 'Marked as important' : 'Removed from important',
      isImportant: email.isImportant
    });
  } catch (error) {
    console.error('Toggle important error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle important'
    });
  }
};

// Get emails by label
exports.getEmailsByLabel = async (req, res) => {
  try {
    const { label } = req.params;
    
    const emails = await Email.find({
      $or: [
        { from: req.user._id },
        { to: req.user.email }
      ],
      labels: label,
      isTrashed: false
    })
      .populate('from', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      emails
    });
  } catch (error) {
    console.error('Get emails by label error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emails by label'
    });
  }
};

// Add label to email
exports.addLabel = async (req, res) => {
  try {
    const { label } = req.body;
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    if (!email.labels.includes(label)) {
      email.labels.push(label);
      await email.save();
    }

    res.json({
      success: true,
      message: 'Label added',
      labels: email.labels
    });
  } catch (error) {
    console.error('Add label error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add label'
    });
  }
};

// Remove label from email
exports.removeLabel = async (req, res) => {
  try {
    const { label } = req.body;
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    email.labels = email.labels.filter(l => l !== label);
    await email.save();

    res.json({
      success: true,
      message: 'Label removed',
      labels: email.labels
    });
  } catch (error) {
    console.error('Remove label error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove label'
    });
  }
};

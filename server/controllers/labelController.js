const User = require('../models/User');

// Get all labels for user
exports.getLabels = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      labels: user.labels || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch labels',
      error: error.message
    });
  }
};

// Create a new label
exports.createLabel = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Label name is required'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if label already exists
    const labelExists = user.labels.some(label => label.name.toLowerCase() === name.toLowerCase());
    if (labelExists) {
      return res.status(400).json({
        success: false,
        message: 'Label already exists'
      });
    }

    // Add new label
    user.labels.push({
      name,
      color: color || '#8b5cf6'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Label created successfully',
      label: user.labels[user.labels.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create label',
      error: error.message
    });
  }
};

// Update a label
exports.updateLabel = async (req, res) => {
  try {
    const { labelId } = req.params;
    const { name, color } = req.body;

    const user = await User.findById(req.user.id);
    const label = user.labels.id(labelId);

    if (!label) {
      return res.status(404).json({
        success: false,
        message: 'Label not found'
      });
    }

    if (name) label.name = name;
    if (color) label.color = color;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Label updated successfully',
      label
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update label',
      error: error.message
    });
  }
};

// Delete a label
exports.deleteLabel = async (req, res) => {
  try {
    const { labelId } = req.params;

    const user = await User.findById(req.user.id);
    const label = user.labels.id(labelId);

    if (!label) {
      return res.status(404).json({
        success: false,
        message: 'Label not found'
      });
    }

    label.remove();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Label deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete label',
      error: error.message
    });
  }
};

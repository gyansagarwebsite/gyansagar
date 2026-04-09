import ContactSettings from '../models/ContactSettings.js';

// Get contact settings
export const getContactSettings = async (req, res) => {
  try {
    let settings = await ContactSettings.findOne({ isActive: true });
    if (!settings) {
      // Create default if not exists
      settings = new ContactSettings({
        email: 'support@gyansagar.com',
        phone: '+977 98765 43210',
        address: 'Kathmandu, Nepal'
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact settings (admin)
export const updateContactSettings = async (req, res) => {
  try {
    let settings = await ContactSettings.findOne({ isActive: true });
    if (!settings) {
      // If not exists, create with body data
      settings = new ContactSettings(req.body);
      const savedSettings = await settings.save();
      return res.json(savedSettings);
    }
    
    const updatedSettings = await ContactSettings.findByIdAndUpdate(
      settings._id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import HeroSettings from '../models/HeroSettings.js';

// Get hero settings
export const getHeroSettings = async (req, res) => {
  try {
    const settings = await HeroSettings.findOne({ isActive: true });
    if (!settings) {
      // Create default if not exists
      const defaultSettings = new HeroSettings({
        heroTitle: 'Prepare Smartly for Loksewa',
        heroSubtitle: 'Daily GK questions and study materials',
        heroButtonText: 'Start Learning',
        facebookLink: 'https://facebook.com/gyansagar',
        facebookDescription: 'Daily GK questions to boost your preparation for competitive exams.'
      });
      await defaultSettings.save();
      res.json(defaultSettings);
    } else {
      res.json(settings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hero settings (admin)
export const updateHeroSettings = async (req, res) => {
  try {
    const settings = await HeroSettings.findOne({ isActive: true });
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    const updatedSettings = await HeroSettings.findByIdAndUpdate(
      settings._id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import mongoose from 'mongoose';

const contactSettingsSchema = new mongoose.Schema({
  email: {
    type: String,
    default: 'support@gyansagar.com'
  },
  phone: {
    type: String,
    default: '+977 98765 43210'
  },
  address: {
    type: String,
    default: 'Kathmandu, Nepal'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('ContactSettings', contactSettingsSchema);

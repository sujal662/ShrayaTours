const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create default admin if none exists
adminSchema.statics.createDefaultAdmin = async function() {
  try {
    const existingAdmin = await this.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.create({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = mongoose.model('Admin', adminSchema);

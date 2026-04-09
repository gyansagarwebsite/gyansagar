import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from '../src/models/Notification.js';
import { createNotification } from '../src/controllers/notificationController.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gyan-sagar';

async function testNotifications() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // 1. Create a test notification
    console.log('Creating test notification...');
    const testNotif = await createNotification({
      title: 'System Test',
      message: 'This is a test notification from the script.',
      type: 'blog',
      link: '/blogs'
    });
    console.log('Created:', testNotif);

    // 2. Fetch all notifications
    console.log('Fetching notifications...');
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
    console.log('Last 5 notifications:', notifications.map(n => ({
      title: n.title,
      isRead: n.isRead,
      createdAt: n.createdAt
    })));

    // 3. Mark the test one as read
    if (testNotif) {
      console.log('Marking test notification as read...');
      testNotif.isRead = true;
      await testNotif.save();
      console.log('Updated successfully.');
    }

    console.log('Test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

testNotifications();

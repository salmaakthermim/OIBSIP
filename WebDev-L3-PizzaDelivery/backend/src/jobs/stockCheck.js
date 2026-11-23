import cron from 'node-cron';
import Ingredient from '../models/Ingredient.js';
import { sendLowStockAlert } from '../utils/sendEmail.js';

// Runs every hour: checks for low stock items and sends email alert
export const startStockCheckJob = () => {
  // Every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[CRON] Running low-stock check...');

      // Find items below threshold that haven't had an alert sent yet
      const lowStockItems = await Ingredient.find({
        $expr: { $lt: ['$stock', '$lowStockThreshold'] },
        isActive: true,
        lowStockAlertSent: false,
      });

      if (lowStockItems.length === 0) {
        console.log('[CRON] All ingredients are well-stocked.');
        return;
      }

      console.log(`[CRON] Found ${lowStockItems.length} low-stock item(s). Sending alert...`);

      await sendLowStockAlert(lowStockItems);

      // Mark alert as sent so we don't spam
      await Ingredient.updateMany(
        { _id: { $in: lowStockItems.map(i => i._id) } },
        { lowStockAlertSent: true }
      );

      console.log('[CRON] Low-stock alert email sent.');
    } catch (err) {
      console.error('[CRON] Stock check error:', err.message);
    }
  });

  console.log('[CRON] Stock check job scheduled (every hour)');
};

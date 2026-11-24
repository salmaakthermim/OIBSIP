import cron from 'node-cron';
import Ingredient from '../models/Ingredient.js';
import Notification from '../models/Notification.js';
import { sendLowStockAlert } from '../utils/sendEmail.js';

// Logic to check stock and dispatch low-stock email
export const runStockCheck = async () => {
  try {
    const lowStockItems = await Ingredient.find({
      $expr: { $lt: ['$stock', '$lowStockThreshold'] },
      isActive: true,
    });

    if (lowStockItems.length === 0) {
      console.log('[STOCK CHECK] All ingredients are well-stocked.');
      return { count: 0, items: [], message: 'All ingredients are well-stocked.' };
    }

    const unsent = lowStockItems.filter(i => !i.lowStockAlertSent);
    if (unsent.length > 0) {
      await sendLowStockAlert(unsent).catch(err =>
        console.error('[STOCK CHECK EMAIL ERROR]:', err.message)
      );
      await Ingredient.updateMany(
        { _id: { $in: unsent.map(i => i._id) } },
        { lowStockAlertSent: true }
      );

      // Save notification log in Notification collection
      await Promise.allSettled(
        unsent.map(item =>
          Notification.create({
            ingredientId: item._id,
            notificationType: 'low_stock_email',
            message: `Low stock alert: ${item.name} (${item.stock} left, threshold ${item.lowStockThreshold})`,
            state: 'sent',
            sentAt: new Date(),
          })
        )
      );
    }

    return {
      count: lowStockItems.length,
      items: lowStockItems,
      alertsSent: unsent.length,
      message: `Found ${lowStockItems.length} item(s) below threshold. Alerts sent for ${unsent.length} item(s).`,
    };
  } catch (err) {
    console.error('[STOCK CHECK ERROR]:', err.message);
    throw err;
  }
};

// Runs every hour: checks for low stock items and sends email alert
export const startStockCheckJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[CRON] Running low-stock check...');
      await runStockCheck();
    } catch (err) {
      console.error('[CRON] Stock check error:', err.message);
    }
  });

  console.log('[CRON] Stock check job scheduled (every hour)');
};

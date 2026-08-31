import { ReminderSettings } from '../types';

export const NotificationService = {
  /**
   * Request browser notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return false;
    }
  },

  /**
   * Check if notifications are currently permitted
   */
  isPermissionGranted(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  },

  /**
   * Send a test or scheduled notification
   */
  sendNotification(title: string, options: { body: string; icon?: string; tag?: string }) {
    if (!this.isPermissionGranted()) {
      return false;
    }

    try {
      const notif = new Notification(title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: '/icon-192.png',
        tag: options.tag || 'satsang-diksha-reminder',
        vibrate: [200, 100, 200]
      } as NotificationOptions);

      notif.onclick = () => {
        window.focus();
        notif.close();
      };

      return true;
    } catch (err) {
      console.error('Failed to trigger notification:', err);
      return false;
    }
  },

  /**
   * Check if reminder should fire based on current local time
   */
  checkAndTriggerReminder(reminder: ReminderSettings, dailyQuote?: string) {
    if (!reminder.enabled) return;

    const now = new Date();
    const [targetHour, targetMinute] = reminder.time.split(':').map(n => parseInt(n, 10));
    
    // Check if within the current minute window
    if (now.getHours() === targetHour && now.getMinutes() === targetMinute) {
      const lastTriggerKey = 'satsang_diksha_last_reminder_date';
      const todayStr = now.toDateString();
      const lastTriggered = localStorage.getItem(lastTriggerKey);

      if (lastTriggered !== todayStr) {
        this.sendNotification('સત્સંગ દીક્ષા સ્વાધ્યાય સમય (Daily Study Reminder)', {
          body: dailyQuote || reminder.customMessage || 'સમય થયો છે સત્સંગ દીક્ષા અધ્યયન અને મુખપાઠ સાધના કરવાનો...',
          icon: '/icon-192.png'
        });
        localStorage.setItem(lastTriggerKey, todayStr);
      }
    }
  }
};

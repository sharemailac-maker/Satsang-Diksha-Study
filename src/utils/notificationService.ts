import { ReminderSettings } from '../types';

/**
 * Robustly parses time string in either 12-hour ("07:40 PM", "7:40 AM") or 24-hour ("19:40", "07:40") format
 */
export function parseTimeString(timeStr?: string): { hour: number; minute: number } | null {
  if (!timeStr) return null;
  const str = timeStr.trim().toUpperCase();
  const isPM = str.includes('PM');
  const isAM = str.includes('AM');
  const cleaned = str.replace(/[AP]M/, '').trim();
  const parts = cleaned.split(':');
  if (parts.length < 2) return null;
  let hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  if (isNaN(hour) || isNaN(minute)) return null;

  if (isPM && hour < 12) {
    hour += 12;
  } else if (isAM && hour === 12) {
    hour = 0;
  }
  return { hour, minute };
}

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
   * Send a test or scheduled notification with ServiceWorker fallback
   */
  async sendNotification(title: string, options: { body: string; icon?: string; tag?: string }): Promise<boolean> {
    if (!('Notification' in window)) return false;

    if (!this.isPermissionGranted()) {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    // Try service worker notification first (better on mobile / PWA)
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && typeof reg.showNotification === 'function') {
          await reg.showNotification(title, {
            body: options.body,
            icon: options.icon || '/icon-192.png',
            badge: '/icon-192.png',
            tag: options.tag || 'satsang-diksha-reminder',
            vibrate: [200, 100, 200]
          } as NotificationOptions);
          return true;
        }
      }
    } catch {
      // fallback to standard Notification
    }

    // Standard Window Notification
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
   * Intimate user that a new app update is available
   */
  sendAppUpdateNotification(version?: string, releaseNotes?: string) {
    const title = version 
      ? `સત્સંગ દીક્ષા એપ અપડેટ ઉપલબ્ધ છે (${version})`
      : 'સત્સંગ દીક્ષા એપનું નવું સંસ્કરણ ઉપલબ્ધ છે!';
    const body = releaseNotes || 'નવા શાસ્ત્રીય સંદર્ભો અને સુધારાઓ ઉપલબ્ધ છે. નવીનતમ સંસ્કરણ મેળવવા માટે કૃપા કરીને એપ ખોલો અને અપડેટ કરો.';

    return this.sendNotification(title, {
      body,
      icon: '/icon-192.png',
      tag: 'satsang-diksha-app-update'
    });
  },

  /**
   * Check if reminder should fire based on current local time
   */
  checkAndTriggerReminder(reminder: ReminderSettings, dailyQuote?: string) {
    if (!reminder || !reminder.enabled || !reminder.time) return;

    const parsed = parseTimeString(reminder.time);
    if (!parsed) return;

    const now = new Date();
    
    // Check if within the current minute window
    if (now.getHours() === parsed.hour && now.getMinutes() === parsed.minute) {
      const lastTriggerKey = 'satsang_diksha_last_reminder_time';
      const todayMinuteStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${parsed.hour}:${parsed.minute}`;
      const lastTriggered = localStorage.getItem(lastTriggerKey);

      if (lastTriggered !== todayMinuteStr) {
        this.sendNotification('સત્સંગ દીક્ષા સ્વાધ્યાય સમય (Daily Study Reminder)', {
          body: dailyQuote || reminder.customMessage || 'સમય થયો છે સત્સંગ દીક્ષા અધ્યયન અને મુખપાઠ સાધના કરવાનો...',
          icon: '/icon-192.png'
        });
        localStorage.setItem(lastTriggerKey, todayMinuteStr);
      }
    }
  }
};

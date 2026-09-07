import { CURRENT_APP_VERSION, AppVersionInfo } from '../version';
import { NotificationService } from './notificationService';

type UpdateListener = (state: UpdateState) => void;

export interface UpdateState {
  updateAvailable: boolean;
  remoteVersion: AppVersionInfo | null;
  currentVersion: AppVersionInfo;
  isChecking: boolean;
  lastChecked: number | null;
  checkStatusMessage?: string | null;
}

class UpdateManagerService {
  private state: UpdateState = {
    updateAvailable: false,
    remoteVersion: null,
    currentVersion: CURRENT_APP_VERSION,
    isChecking: false,
    lastChecked: null,
    checkStatusMessage: null
  };

  private listeners: Set<UpdateListener> = new Set();
  private isMonitoring = false;
  private timerId: number | null = null;
  private hasNotifiedSystem = false;

  constructor() {
    // Listen for PWA service worker custom events
    if (typeof window !== 'undefined') {
      window.addEventListener('pwa-update-available', () => {
        this.markUpdateAvailable({
          version: CURRENT_APP_VERSION.version,
          buildTime: Date.now(),
          releaseDate: new Date().toISOString().split('T')[0],
          releaseNotesGu: 'નવા શાસ્ત્રીય સંદર્ભો અને અપડેટ્સ ઉપલબ્ધ છે.',
          releaseNotesHi: 'नए शास्त्रीय संदर्भ और अपडेट उपलब्ध हैं।',
          releaseNotesEn: 'New scriptural references and updates available.'
        });
      });
    }
  }

  public getState(): UpdateState {
    return { ...this.state };
  }

  public subscribe(listener: UpdateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach(fn => fn(currentState));
  }

  /**
   * Set update as available and intimate the user
   */
  public markUpdateAvailable(info?: Partial<AppVersionInfo>) {
    const fullInfo: AppVersionInfo = {
      version: info?.version || '2.5.0',
      buildTime: info?.buildTime || Date.now(),
      releaseDate: info?.releaseDate || new Date().toISOString().split('T')[0],
      releaseNotesGu: info?.releaseNotesGu || CURRENT_APP_VERSION.releaseNotesGu,
      releaseNotesHi: info?.releaseNotesHi || CURRENT_APP_VERSION.releaseNotesHi,
      releaseNotesEn: info?.releaseNotesEn || CURRENT_APP_VERSION.releaseNotesEn
    };

    this.state.updateAvailable = true;
    this.state.remoteVersion = fullInfo;
    this.state.isChecking = false;
    this.state.checkStatusMessage = 'નવું સંસ્કરણ ઉપલબ્ધ છે! (Update available)';
    this.notify();

    // Trigger device system notification once per update discovery
    if (!this.hasNotifiedSystem) {
      this.hasNotifiedSystem = true;
      try {
        NotificationService.sendAppUpdateNotification(
          fullInfo.version,
          fullInfo.releaseNotesGu
        );
      } catch (e) {
        console.warn('[UpdateManager] Notification trigger skipped:', e);
      }
    }

    // Broadcast globally to any listening components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-update-available', { detail: fullInfo }));
    }
  }

  /**
   * Check for updates on server and service worker
   */
  public async checkForUpdates(isBackground = false): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check online status
    if (!navigator.onLine) {
      if (!isBackground) {
        this.state.checkStatusMessage = 'ઓફલાઇન: કૃપા કરીને ઇન્ટરનેટ કનેક્શન ચકાસો. (Offline)';
        this.notify();
      }
      return false;
    }

    if (this.state.isChecking) return this.state.updateAvailable;

    this.state.isChecking = true;
    if (!isBackground) {
      this.state.checkStatusMessage = 'નવા સંસ્કરણની તપાસ થઈ રહી છે... (Checking for updates...)';
    }
    this.notify();

    let foundUpdate = false;

    try {
      // 1. Check /version.json with cache: no-store
      const resp = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });

      if (resp.ok) {
        const remoteInfo: AppVersionInfo = await resp.json();
        const isNewerBuild = remoteInfo.buildTime > CURRENT_APP_VERSION.buildTime;
        const isDifferentVersion = remoteInfo.version !== CURRENT_APP_VERSION.version;

        if (isNewerBuild || isDifferentVersion) {
          foundUpdate = true;
          this.markUpdateAvailable(remoteInfo);
          return true;
        }
      }
    } catch (err) {
      console.log('[UpdateManager] Remote version fetch note:', err);
    }

    // 2. Check ServiceWorker registrations
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          if (reg.waiting) {
            foundUpdate = true;
            this.markUpdateAvailable();
            return true;
          }
          // Request SW background check
          await reg.update();
          if (reg.waiting) {
            foundUpdate = true;
            this.markUpdateAvailable();
            return true;
          }
        }
      }
    } catch (err) {
      console.log('[UpdateManager] SW update check note:', err);
    }

    this.state.isChecking = false;
    this.state.lastChecked = Date.now();
    if (!foundUpdate && !isBackground) {
      this.state.checkStatusMessage = 'તમારું એપ અપ-ટુ-ડેટ છે! (App is up to date) ✓';
      setTimeout(() => {
        if (this.state.checkStatusMessage?.includes('અપ-ટુ-ડેટ')) {
          this.state.checkStatusMessage = null;
          this.notify();
        }
      }, 4000);
    }
    this.notify();

    return foundUpdate;
  }

  /**
   * Apply update: skip waiting, clear cache and reload
   */
  public async applyUpdate(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          if (reg.waiting) {
            reg.waiting.postMessage({ action: 'SKIP_WAITING' });
          }
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (e) {
      console.warn('[UpdateManager] Apply update warning:', e);
    } finally {
      window.location.reload();
    }
  }

  /**
   * Dismiss update notification temporarily for this session
   */
  public dismissUpdate() {
    this.state.updateAvailable = false;
    this.notify();
  }

  /**
   * Initialize background monitoring:
   * - Checks whenever user visits the app
   * - Checks whenever user comes online
   * - Checks when tab regains focus or visibility
   * - Checks periodically in background while online
   */
  public startBackgroundMonitoring(intervalMs = 90000): () => void {
    if (this.isMonitoring || typeof window === 'undefined') {
      return () => {};
    }

    this.isMonitoring = true;

    // 1. Initial check when visitor visits app
    setTimeout(() => {
      this.checkForUpdates(true);
    }, 2500);

    // 2. Check whenever user comes online
    const handleOnline = () => {
      console.log('[UpdateManager] User came online; checking for updates in background...');
      this.checkForUpdates(true);
    };

    // 3. Check when window regains focus or becomes visible
    const handleFocus = () => {
      this.checkForUpdates(true);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdates(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // 4. Periodic background check
    this.timerId = window.setInterval(() => {
      if (navigator.onLine) {
        this.checkForUpdates(true);
      }
    }, intervalMs);

    return () => {
      this.isMonitoring = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (this.timerId !== null) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    };
  }
}

export const UpdateManager = new UpdateManagerService();

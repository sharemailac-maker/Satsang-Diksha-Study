import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker with robust update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PWA] ServiceWorker registered with scope:', reg.scope);

        // Check if a worker is already waiting to be activated from a prior background fetch
        if (reg.waiting && navigator.serviceWorker.controller) {
          console.log('[PWA] Existing worker waiting for activation');
          window.dispatchEvent(new CustomEvent('pwa-update-available'));
        }

        // Check for updates periodically and when user is online or window regains focus
        const checkForUpdates = () => {
          if (navigator.onLine) {
            reg.update().catch((err) => console.log('[PWA] Update check failed:', err));
          }
        };

        // Check on startup
        setTimeout(checkForUpdates, 1500);

        window.addEventListener('online', checkForUpdates);
        window.addEventListener('focus', checkForUpdates);
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            checkForUpdates();
          }
        });

        // Listen for new worker installed
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New content is available; dispatching pwa-update-available event');
                window.dispatchEvent(new CustomEvent('pwa-update-available'));
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log('[PWA] ServiceWorker registration error:', err);
      });
  });

  // Listen for controlling service worker changes (reload page once)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// Prevent copying, cutting, context menu, image dragging, and text selection
if (typeof window !== 'undefined') {
  // Prevent contextmenu (right-click / long press on images or text)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  }, { capture: true, passive: false });

  // Prevent clipboard copy
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, { capture: true, passive: false });

  // Prevent clipboard cut
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, { capture: true, passive: false });

  // Prevent drag-and-drop of images and text
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
  }, { capture: true, passive: false });

  // Prevent text selection (allow only interactive inputs & textareas)
  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    e.preventDefault();
  }, { capture: true, passive: false });

  // Block copy/cut/select-all/save keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const isModifier = e.ctrlKey || e.metaKey;
    if (!isModifier) return;

    const key = e.key.toLowerCase();
    const target = e.target as HTMLElement | null;
    const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    // Block Ctrl/Cmd + C (Copy) and Ctrl/Cmd + X (Cut)
    if (key === 'c' || key === 'x') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Block Ctrl/Cmd + A (Select All) outside inputs
    if (key === 'a' && !isInput) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Block Ctrl/Cmd + S (Save), U (View Source), P (Print)
    if (key === 's' || key === 'u' || key === 'p') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }, { capture: true, passive: false });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

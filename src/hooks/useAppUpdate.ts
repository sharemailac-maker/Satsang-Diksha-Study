import { useState, useEffect, useCallback } from 'react';
import { UpdateManager, UpdateState } from '../utils/updateManager';

export function useAppUpdate() {
  const [state, setState] = useState<UpdateState>(UpdateManager.getState());

  useEffect(() => {
    const unsubscribe = UpdateManager.subscribe((newState) => {
      setState(newState);
    });

    // Start background monitoring when hook mounts
    const stopMonitoring = UpdateManager.startBackgroundMonitoring(120000); // Check every 2 minutes

    return () => {
      unsubscribe();
      stopMonitoring();
    };
  }, []);

  const checkForUpdates = useCallback(async (isBackground = false) => {
    return await UpdateManager.checkForUpdates(isBackground);
  }, []);

  const applyUpdate = useCallback(async () => {
    await UpdateManager.applyUpdate();
  }, []);

  const dismissUpdate = useCallback(() => {
    UpdateManager.dismissUpdate();
  }, []);

  return {
    updateAvailable: state.updateAvailable,
    remoteVersion: state.remoteVersion,
    currentVersion: state.currentVersion,
    isChecking: state.isChecking,
    lastChecked: state.lastChecked,
    checkStatusMessage: state.checkStatusMessage,
    checkForUpdates,
    applyUpdate,
    dismissUpdate
  };
}

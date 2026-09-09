// Built-in Anonymous Hit Counter Service
// Strictly anonymous: No user identifiers, no IP logging, no cookies.
// Tracks aggregate application accesses and displays live visit count.

import { useState, useEffect, useCallback } from 'react';

const COUNTER_NAMESPACE = 'satsang-diksha-shastra';
const COUNTER_KEY = 'app-visits';
const PRIMARY_API_BASE = 'https://abacus.jasoncameron.dev';

const CACHE_KEY = 'sd_anonymous_hit_count';
const CACHE_TIME_KEY = 'sd_anonymous_hit_time';
const SESSION_FLAG_KEY = 'sd_session_visit_registered';

export interface HitCounterState {
  count: number;
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
}

// Initial count seed fallback if completely offline on first launch
const INITIAL_BASELINE_COUNT = 1;

/**
 * Get locally cached hit count
 */
export function getCachedHitCount(): number {
  if (typeof window === 'undefined') return INITIAL_BASELINE_COUNT;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = parseInt(cached, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch {
    // Ignore storage error
  }
  return INITIAL_BASELINE_COUNT;
}

/**
 * Save hit count to local cache
 */
function setCachedHitCount(val: number) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, String(val));
    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
  } catch {
    // Ignore storage error
  }
}

/**
 * Register a session hit (increment once per browser session)
 * or fetch current count if already registered in this session.
 */
export async function recordOrFetchVisit(): Promise<{ count: number; isLive: boolean }> {
  const cached = getCachedHitCount();
  
  if (typeof window === 'undefined') {
    return { count: cached, isLive: false };
  }

  // Check if this browser session has already been counted
  let alreadyCountedInSession = false;
  try {
    alreadyCountedInSession = sessionStorage.getItem(SESSION_FLAG_KEY) === 'true';
  } catch {
    // sessionStorage unavailable
  }

  const endpoint = alreadyCountedInSession 
    ? `${PRIMARY_API_BASE}/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
    : `${PRIMARY_API_BASE}/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        setCachedHitCount(data.value);
        if (!alreadyCountedInSession) {
          try {
            sessionStorage.setItem(SESSION_FLAG_KEY, 'true');
          } catch {
            // Ignore sessionStorage quota
          }
        }
        return { count: data.value, isLive: true };
      }
    }
  } catch (err) {
    console.warn('Anonymous hit counter network fetch failed, using cached count:', err);
  }

  return { count: cached, isLive: false };
}

/**
 * Query current hit count without incrementing
 */
export async function fetchCurrentCount(): Promise<{ count: number; isLive: boolean }> {
  const cached = getCachedHitCount();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${PRIMARY_API_BASE}/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        setCachedHitCount(data.value);
        return { count: data.value, isLive: true };
      }
    }
  } catch (err) {
    console.warn('Unable to refresh hit counter:', err);
  }

  return { count: cached, isLive: false };
}

/**
 * React hook for consuming and refreshing the hit counter in components
 */
export function useHitCounter() {
  const [state, setState] = useState<HitCounterState>(() => ({
    count: getCachedHitCount(),
    isLoading: true,
    isLive: false,
    error: null
  }));

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const result = await fetchCurrentCount();
    setState({
      count: result.count,
      isLoading: false,
      isLive: result.isLive,
      error: result.isLive ? null : 'ઓફલાઇન કેશ ગણતરી'
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    recordOrFetchVisit().then(result => {
      if (isMounted) {
        setState({
          count: result.count,
          isLoading: false,
          isLive: result.isLive,
          error: result.isLive ? null : 'ઓફલાઇન કેશ ગણતરી'
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...state,
    refresh
  };
}

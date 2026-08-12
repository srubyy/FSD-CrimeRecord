import { useState, useEffect, useRef } from 'react';

/**
 * Custom Hook: usePersistedState
 * Behaves like useState, but reads its initial value from localStorage (falling back to initialValue)
 * and writes to localStorage on state mutations via an internal useEffect.
 * Includes a guard (isFirstRender ref) so it doesn't run unnecessarily on first mount if data is hydrated from storage.
 */
export default function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const savedItem = localStorage.getItem(key);
      if (savedItem !== null) {
        return JSON.parse(savedItem);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  // Guard to skip unnecessary write on initial mount if hydrated
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

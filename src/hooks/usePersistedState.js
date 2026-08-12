import { useState, useEffect } from 'react';

/**
 * Custom Hook: usePersistedState
 * Behaves like useState, but reads its initial value from localStorage (falling back to initialValue)
 * and automatically writes state updates to localStorage via an internal useEffect.
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

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

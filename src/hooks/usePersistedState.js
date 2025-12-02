import { useEffect, useState } from 'react';

/**
 * A hook to persist state between page reloads using localStorage.
 *
 * @param {string} storageKey - The key under which to store the state in localStorage.
 * @param {*} initialState - The initial state value if no stored value is found.
 * @returns {Array} A stateful value, and a function to update it.
 */
export const usePersistedState = (storageKey, initialState) => {
  // Initialize state with initialState or the stored value
  const [state, setState] = useState(() => {
    try {
      const storageValue = localStorage.getItem(storageKey);
      return storageValue ? JSON.parse(storageValue) : initialState;
    } catch (error) {
      return initialState;
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      const storageValue = JSON.stringify(state);
      localStorage.setItem(storageKey, storageValue);
    } catch (error) {
    }
  }, [state, storageKey]);

  return [state, setState];
};

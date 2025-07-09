import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get value from localStorage on initialization
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Handle Date objects specifically for test sessions
        if (key.includes('testHistory') || key.includes('Session')) {
          return reviveDates(parsed);
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore, dateReplacer));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Helper function to handle Date serialization
function dateReplacer(key: string, value: any) {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() };
  }
  return value;
}

// Helper function to revive Date objects
function reviveDates(obj: any): any {
  if (obj && typeof obj === 'object') {
    if (obj.__type === 'Date') {
      return new Date(obj.value);
    }
    if (Array.isArray(obj)) {
      return obj.map(reviveDates);
    }
    const revived: any = {};
    for (const key in obj) {
      revived[key] = reviveDates(obj[key]);
    }
    return revived;
  }
  return obj;
}
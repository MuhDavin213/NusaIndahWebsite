import { useState, useEffect } from 'react';

const STORAGE_EVENT_NAME = 'localstorage:update';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State untuk menyimpan value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage ketika value berubah
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT_NAME, { detail: { key } })
      );
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  // Sync antar komponen dan antar tab
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      try {
        const item = event.newValue;
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error(`Error parsing ${key} from storage event:`, error);
      }
    };

    const handleCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (detail?.key !== key) return;
      try {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error(`Error parsing ${key} from custom event:`, error);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(STORAGE_EVENT_NAME, handleCustom as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(STORAGE_EVENT_NAME, handleCustom as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setStoredValue] as const;
}

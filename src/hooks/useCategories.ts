import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { subscribeKategori, saveKategori, deleteKategori } from '../database/kategori';

const CATEGORIES_KEY = 'toko_nusa_indah_categories';

const DEFAULT_CATEGORIES = [
  'Makanan & Minuman',
  'Snack & Permen',
  'Kebutuhan Rumah Tangga',
  'Mainan & Boneka',
  'Alat Tulis',
  'Perawatan Pribadi'
];

export function useCategories() {
  const [localCategories, setLocalCategories] = useLocalStorage<string[]>(
    CATEGORIES_KEY,
    DEFAULT_CATEGORIES
  );
  const [categories, setCategories] = useState<string[]>(localCategories);
  const [useFirebase, setUseFirebase] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeKategori((kategori) => {
      setCategories(kategori);
      setUseFirebase(true);
    });

    if (!unsubscribe) {
      setUseFirebase(false);
      setCategories(localCategories);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!useFirebase) {
      setCategories(localCategories);
    }
  }, [localCategories, useFirebase]);

  const addCategory = (newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) {
      return false;
    }

    if (useFirebase) {
      setCategories([...categories, trimmed]);
      void saveKategori(trimmed).catch((error) => {
        console.error('Gagal menyimpan kategori ke Firebase:', error?.message || error);
      });
    } else {
      setLocalCategories([...localCategories, trimmed]);
    }

    return true;
  };

  const removeCategory = (category: string) => {
    if (DEFAULT_CATEGORIES.includes(category)) {
      return false; // Tidak boleh hapus kategori default
    }

    if (useFirebase) {
      setCategories(categories.filter((c) => c !== category));
      void deleteKategori(category).catch((error) => {
        console.error('Gagal menghapus kategori di Firebase:', error?.message || error);
      });
    } else {
      setLocalCategories(localCategories.filter((c) => c !== category));
    }

    return true;
  };

  const resetCategories = () => {
    if (useFirebase) {
      const toDelete = categories.filter((c) => !DEFAULT_CATEGORIES.includes(c));
      toDelete.forEach((c) => {
        void deleteKategori(c).catch((error) => {
          console.error('Gagal menghapus kategori di Firebase:', error?.message || error);
        });
      });

      DEFAULT_CATEGORIES.forEach((c) => {
        void saveKategori(c).catch((error) => {
          console.error('Gagal menyimpan kategori default ke Firebase:', error?.message || error);
        });
      });

      setCategories(DEFAULT_CATEGORIES);
    } else {
      setLocalCategories(DEFAULT_CATEGORIES);
    }
  };

  return {
    categories,
    addCategory,
    removeCategory,
    resetCategories,
    isDefaultCategory: (category: string) => DEFAULT_CATEGORIES.includes(category)
  };
}

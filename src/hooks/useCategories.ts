import { useEffect, useState } from 'react';
import { deleteKategori, saveKategori, subscribeKategori } from '../database/kategori';

const DEFAULT_CATEGORIES = [
  'Makanan & Minuman',
  'Snack & Permen',
  'Kebutuhan Rumah Tangga',
  'Mainan & Boneka',
  'Alat Tulis',
  'Perawatan Pribadi'
];

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeKategori(
      (kategori) => {
        setCategories(kategori);
        setIsLoading(false);
        setError(null);
      },
      (errorMessage) => {
        setIsLoading(false);
        setError(errorMessage);
      }
    );

    if (!unsubscribe) {
      setIsLoading(false);
      setError('Koneksi Firebase kategori gagal. Periksa konfigurasi dan rules Firestore.');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addCategory = async (newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) {
      return false;
    }

    setCategories((prev) => [...prev, trimmed]);
    try {
      await saveKategori(trimmed);
      return true;
    } catch (saveError: any) {
      setCategories((prev) => prev.filter((c) => c !== trimmed));
      setError(saveError?.message || 'Gagal menyimpan kategori di Firebase.');
      return false;
    }
  };

  const removeCategory = async (category: string) => {
    if (DEFAULT_CATEGORIES.includes(category)) {
      return false;
    }

    const previous = categories;
    setCategories((prev) => prev.filter((c) => c !== category));
    try {
      await deleteKategori(category);
      return true;
    } catch (deleteError: any) {
      setCategories(previous);
      setError(deleteError?.message || 'Gagal menghapus kategori di Firebase.');
      return false;
    }
  };

  const resetCategories = async () => {
    const toDelete = categories.filter((c) => !DEFAULT_CATEGORIES.includes(c));

    try {
      await Promise.all(toDelete.map((c) => deleteKategori(c)));
      await Promise.all(DEFAULT_CATEGORIES.map((c) => saveKategori(c)));
      setCategories(DEFAULT_CATEGORIES);
      setError(null);
    } catch (resetError: any) {
      setError(resetError?.message || 'Gagal reset kategori default di Firebase.');
    }
  };

  const clearError = () => setError(null);

  return {
    categories,
    isLoading,
    error,
    clearError,
    addCategory,
    removeCategory,
    resetCategories,
    isDefaultCategory: (category: string) => DEFAULT_CATEGORIES.includes(category)
  };
}

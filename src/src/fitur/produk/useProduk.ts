import { useState, useEffect } from 'react';
import { subscribeProduk, tambahProduk, updateProduk, hapusProduk } from '../../database/koleksi';
import type { Produk } from './tipe';

export function useProduk() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeProduk((data) => {
      setProduk(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const tambah = async (data: Omit<Produk, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await tambahProduk(data);
      return { success: true, id };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const update = async (id: string, data: Partial<Produk>) => {
    try {
      await updateProduk(id, data);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const hapus = async (id: string) => {
    try {
      await hapusProduk(id);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    produk,
    loading,
    error,
    tambah,
    update,
    hapus,
  };
}

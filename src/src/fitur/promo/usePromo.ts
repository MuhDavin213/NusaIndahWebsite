import { useState, useEffect } from 'react';
import { subscribePromo, updatePromo } from '../../database/koleksi';
import type { Promo } from '../produk/tipe';

export function usePromo() {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribePromo((data) => {
      setPromo(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const update = async (data: Omit<Promo, 'id' | 'updatedAt'>) => {
    try {
      await updatePromo(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    promo,
    loading,
    update,
  };
}

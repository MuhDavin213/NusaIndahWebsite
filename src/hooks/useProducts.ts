import { useEffect, useState } from 'react';
import type { Barang } from '../types';
import { normalizeCategory } from '../utils/categoryHelper';
import { deleteProduk, saveProduk, subscribeProduk } from '../database/produk';

export function useProducts() {
  const [products, setProducts] = useState<Barang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeProduk(
      (produk) => {
        setProducts(produk);
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
      setError('Koneksi Firebase produk gagal. Periksa konfigurasi dan rules Firestore.');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addProduct = async (product: Omit<Barang, 'id_barang'>) => {
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id_barang)) + 1 : 1;
    const newProduct: Barang = {
      ...product,
      id_barang: newId
    };

    setProducts((prev) => [...prev, newProduct]);
    try {
      await saveProduk(newProduct);
    } catch (saveError: any) {
      setProducts((prev) => prev.filter((p) => p.id_barang !== newId));
      setError(saveError?.message || 'Gagal menyimpan produk ke Firebase.');
    }
  };

  const updateProduct = async (product: Barang) => {
    const previous = products;
    setProducts((prev) =>
      prev.map((p) => (p.id_barang === product.id_barang ? product : p))
    );
    try {
      await saveProduk(product);
    } catch (saveError: any) {
      setProducts(previous);
      setError(saveError?.message || 'Gagal update produk di Firebase.');
    }
  };

  const deleteProduct = async (id_barang: number) => {
    const previous = products;
    setProducts((prev) => prev.filter((p) => p.id_barang !== id_barang));
    try {
      await deleteProduk(id_barang);
    } catch (deleteError: any) {
      setProducts(previous);
      setError(deleteError?.message || 'Gagal hapus produk di Firebase.');
    }
  };

  const getProductById = (id_barang: number) => {
    return products.find((p) => p.id_barang === id_barang);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'Semua') return products;
    const normalized = normalizeCategory(category);
    return products.filter((p) => normalizeCategory(p.kategori) === normalized);
  };

  const clearError = () => setError(null);

  return {
    products,
    isLoading,
    error,
    clearError,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory
  };
}

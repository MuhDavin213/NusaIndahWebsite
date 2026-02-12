import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { initialProducts } from '../data/products';
import { STORAGE_KEYS } from '../utils/constants';
import type { Barang } from '../types';
import { normalizeCategory } from '../utils/categoryHelper';
import { subscribeProduk, saveProduk, deleteProduk } from '../database/produk';

export function useProducts() {
  const [localProducts, setLocalProducts] = useLocalStorage<Barang[]>(
    STORAGE_KEYS.PRODUCTS,
    initialProducts
  );
  const [products, setProducts] = useState<Barang[]>(localProducts);
  const [useFirebase, setUseFirebase] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeProduk((produk) => {
      setProducts(produk);
      setUseFirebase(true);
    });

    if (!unsubscribe) {
      setUseFirebase(false);
      setProducts(localProducts);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!useFirebase) {
      setProducts(localProducts);
    }
  }, [localProducts, useFirebase]);

  const addProduct = (product: Omit<Barang, 'id_barang'>) => {
    const newId = products.length > 0 
      ? Math.max(...products.map(p => p.id_barang)) + 1 
      : 1;
    
    const newProduct: Barang = {
      ...product,
      id_barang: newId
    };

    if (useFirebase) {
      // Optimistic update
      setProducts([...products, newProduct]);
      void saveProduk(newProduct).catch((error) => {
        console.error('Gagal menyimpan produk ke Firebase:', error?.message || error);
      });
    } else {
      setLocalProducts([...localProducts, newProduct]);
    }
  };

  const updateProduct = (product: Barang) => {
    if (useFirebase) {
      setProducts(products.map(p => 
        p.id_barang === product.id_barang ? product : p
      ));
      void saveProduk(product).catch((error) => {
        console.error('Gagal update produk di Firebase:', error?.message || error);
      });
    } else {
      setLocalProducts(localProducts.map(p => 
        p.id_barang === product.id_barang ? product : p
      ));
    }
  };

  const deleteProduct = (id_barang: number) => {
    if (useFirebase) {
      setProducts(products.filter(p => p.id_barang !== id_barang));
      void deleteProduk(id_barang).catch((error) => {
        console.error('Gagal hapus produk di Firebase:', error?.message || error);
      });
    } else {
      setLocalProducts(localProducts.filter(p => p.id_barang !== id_barang));
    }
  };

  const getProductById = (id_barang: number) => {
    return products.find(p => p.id_barang === id_barang);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'Semua') return products;
    const normalized = normalizeCategory(category);
    return products.filter(p => normalizeCategory(p.kategori) === normalized);
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory
  };
}

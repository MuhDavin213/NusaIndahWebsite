import { useState, useEffect, useCallback } from 'react';
import type { ItemKeranjang, Keranjang } from './tipe';
import type { Produk } from '../produk/tipe';

const STORAGE_KEY = 'toko_nusa_indah_cart';

export function useKeranjang(produkList: Produk[]) {
  const [keranjang, setKeranjang] = useState<Keranjang>({
    items: [],
    totalItems: 0,
    totalHarga: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setKeranjang(parsed);
      } catch (e) {
        console.error('Error parsing cart:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
  }, [keranjang]);

  const hitungTotal = useCallback((items: ItemKeranjang[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
    const totalHarga = items.reduce((sum, item) => sum + item.subtotal, 0);
    return { totalItems, totalHarga };
  }, []);

  const tambahKeKeranjang = useCallback((produk: Produk, qty: number) => {
    setKeranjang((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.productId === produk.id);
      let newItems: ItemKeranjang[];

      if (existingIndex >= 0) {
        newItems = [...prev.items];
        const newQty = newItems[existingIndex].qty + qty;
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          qty: Math.min(newQty, produk.stok),
          subtotal: Math.min(newQty, produk.stok) * produk.harga,
          stokTersedia: produk.stok,
        };
      } else {
        const newItem: ItemKeranjang = {
          id: `cart_${Date.now()}_${Math.random()}`,
          productId: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          qty: Math.min(qty, produk.stok),
          subtotal: Math.min(qty, produk.stok) * produk.harga,
          imageUrl: produk.imageUrl,
          stokTersedia: produk.stok,
        };
        newItems = [...prev.items, newItem];
      }

      const { totalItems, totalHarga } = hitungTotal(newItems);
      return {
        items: newItems,
        totalItems,
        totalHarga,
      };
    });
  }, [hitungTotal]);

  const updateQty = useCallback((itemId: string, newQty: number) => {
    setKeranjang((prev) => {
      const newItems = prev.items
        .map((item) => {
          if (item.id === itemId) {
            if (newQty <= 0) return null;
            const validQty = Math.min(newQty, item.stokTersedia);
            return {
              ...item,
              qty: validQty,
              subtotal: validQty * item.harga,
            };
          }
          return item;
        })
        .filter((item): item is ItemKeranjang => item !== null);

      const { totalItems, totalHarga } = hitungTotal(newItems);
      return {
        items: newItems,
        totalItems,
        totalHarga,
      };
    });
  }, [hitungTotal]);

  const hapusItem = useCallback((itemId: string) => {
    setKeranjang((prev) => {
      const newItems = prev.items.filter((item) => item.id !== itemId);
      const { totalItems, totalHarga } = hitungTotal(newItems);
      return {
        items: newItems,
        totalItems,
        totalHarga,
      };
    });
  }, [hitungTotal]);

  const kosongkanKeranjang = useCallback(() => {
    setKeranjang({
      items: [],
      totalItems: 0,
      totalHarga: 0,
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const syncStokDariFirestore = useCallback(() => {
    setKeranjang((prev) => {
      const newItems = prev.items
        .map((item) => {
          const produk = produkList.find((p) => p.id === item.productId);
          
          if (!produk || !produk.aktif) {
            return null;
          }

          if (produk.stok === 0) {
            return null;
          }

          const validQty = Math.min(item.qty, produk.stok);
          return {
            ...item,
            stokTersedia: produk.stok,
            qty: validQty,
            subtotal: validQty * item.harga,
            harga: produk.harga,
          };
        })
        .filter((item): item is ItemKeranjang => item !== null);

      const { totalItems, totalHarga } = hitungTotal(newItems);
      return {
        items: newItems,
        totalItems,
        totalHarga,
      };
    });
  }, [produkList, hitungTotal]);

  useEffect(() => {
    if (produkList.length > 0) {
      syncStokDariFirestore();
    }
  }, [produkList, syncStokDariFirestore]);

  return {
    keranjang,
    tambahKeKeranjang,
    updateQty,
    hapusItem,
    kosongkanKeranjang,
  };
}

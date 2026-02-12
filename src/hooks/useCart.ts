import { useState } from 'react';
import type { Keranjang, DetailKeranjang, Barang } from '../types';

const createInitialCart = (): Keranjang => ({
  id_keranjang: 1,
  id_user: 1,
  tanggal_dibuat: new Date().toISOString(),
  items: []
});

export function useCart(products: Barang[]) {
  const [cart, setCart] = useState<Keranjang>(createInitialCart);

  const addToCart = (product: Barang, quantity: number) => {
    const existingItemIndex = cart.items.findIndex(
      item => item.id_barang === product.id_barang
    );

    if (existingItemIndex >= 0) {
      // Update item yang sudah ada
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex].jumlah += quantity;
      updatedItems[existingItemIndex].subtotal = 
        updatedItems[existingItemIndex].jumlah * product.harga;
      
      setCart({ ...cart, items: updatedItems });
    } else {
      // Tambah item baru
      const newId = cart.items.length > 0 
        ? Math.max(...cart.items.map(i => i.id_detail)) + 1 
        : 1;
      
      const newItem: DetailKeranjang = {
        id_detail: newId,
        id_barang: product.id_barang,
        nama_barang: product.nama_barang,
        harga: product.harga,
        jumlah: quantity,
        subtotal: quantity * product.harga
      };
      
      setCart({ ...cart, items: [...cart.items, newItem] });
    }
  };

  const updateCartItem = (id_detail: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id_detail);
      return;
    }

    const updatedItems = cart.items.map(item => {
      if (item.id_detail === id_detail) {
        const product = products.find(p => p.id_barang === item.id_barang);
        return {
          ...item,
          jumlah: quantity,
          subtotal: quantity * (product?.harga || 0)
        };
      }
      return item;
    });

    setCart({ ...cart, items: updatedItems });
  };

  const removeFromCart = (id_detail: number) => {
    setCart({
      ...cart,
      items: cart.items.filter(item => item.id_detail !== id_detail)
    });
  };

  const removeProductFromCart = (id_barang: number) => {
    setCart({
      ...cart,
      items: cart.items.filter(item => item.id_barang !== id_barang)
    });
  };

  const clearCart = () => {
    setCart(createInitialCart());
  };

  const getCartItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.jumlah, 0);
  };

  const getCartTotal = () => {
    return cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  return {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    removeProductFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal
  };
}

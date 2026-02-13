# Ringkasan 1 Halaman - Alur dan File Penting

## Entry Point
`src/main.tsx` -> render `src/App.tsx`

## Halaman Utama
Beranda: `src/pages/Beranda.tsx`
Cart: `src/pages/CartPage.tsx`
Kelola: `src/pages/KelolaPage.tsx`

## Data dan State
Produk: `src/hooks/useProducts.ts`
Cart: `src/hooks/useCart.ts`
Kategori: `src/hooks/useCategories.ts`
LocalStorage: `src/hooks/useLocalStorage.ts`

## Firebase
Init: `src/database/firebase.ts`
Produk: `src/database/produk.ts`
Promo: `src/database/promo.ts`
Pesanan: `src/database/pesanan.ts`
Config: `.env`

## Alur Cepat Fitur
1. Produk tampil
`useProducts` -> Firestore (Firebase-only) + loading/error state

2. Add to cart
`ProductCard` -> `useCart.addToCart` -> cart state memory

3. Checkout
`CheckoutModal` -> `simpanPesananDanKurangiStok` -> simpan pesanan + update stok

4. Promo diskon
`CartPage` -> `getPromoConfig` -> diskon dihitung jika aktif

5. Admin
`KelolaPage` -> `PasswordProtection` -> modul admin (produk, kategori, promo)

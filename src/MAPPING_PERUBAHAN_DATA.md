# Mapping Perubahan Data per Fitur

Dokumen ini menjelaskan data apa yang berubah, di mana disimpan, dan kapan terjadi perubahan.

## 1. Produk
Sumber: Firestore `produk` (Firebase-only)
File terkait:
`src/hooks/useProducts.ts`
`src/database/produk.ts`

Perubahan data:
Tambah produk -> tambah doc di Firestore
Edit produk -> update doc di Firestore
Hapus produk -> delete doc di Firestore

## 2. Keranjang
Sumber: Memory (reset saat reload)
File terkait:
`src/hooks/useCart.ts`
`src/pages/CartPage.tsx`

Perubahan data:
Add item -> tambah item ke cart state
Update qty -> update `jumlah` dan `subtotal`
Remove item -> hapus item dari cart
Clear cart -> cart kosong

## 3. Checkout dan Print
Sumber: Firestore `pesanan` dan `produk`
File terkait:
`src/components/CheckoutModal.tsx`
`src/database/pesanan.ts`

Perubahan data saat Print:
1. Buat dokumen baru di `pesanan`
2. Update field `stok` di `produk` (dikurangi)

## 4. Promo Diskon Checkout
Sumber: Firestore `konfigurasi/promo`
File terkait:
`src/database/promo.ts`
`src/pages/CartPage.tsx`

Perubahan data:
Tidak ada perubahan data dari app
App hanya membaca `aktif` dan `discountPercent`

## 5. Banner Promo Beranda
Sumber: Firestore `promo_banner`
File terkait:
`src/features/admin/PromoManagement.tsx`
`src/components/features/PromoBanner.tsx`
`src/database/promoBanner.ts`

Perubahan data:
Tambah/edit/hapus banner -> update Firestore

## 6. Kategori
Sumber: localStorage
File terkait:
`src/hooks/useCategories.ts`
`src/features/admin/CategoryManagement.tsx`

Perubahan data:
Tambah kategori -> update localStorage
Hapus kategori -> update localStorage
Reset kategori -> kembali ke default

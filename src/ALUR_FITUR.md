# Panduan Alur Fitur dan Fungsi File

Dokumen ini menjelaskan urutan pembuatan fitur, alur kerja tiap fitur, dan file yang terlibat. Fokusnya adalah membantu memahami "alur besar" tanpa harus membaca semua kode sekaligus.

## Ringkasan Struktur
Entry point aplikasi: `src/main.tsx` -> `src/App.tsx`

Halaman utama:
`src/pages/Beranda.tsx`, `src/pages/CartPage.tsx`, `src/pages/KelolaPage.tsx`, `src/pages/TentangKami.tsx`, `src/pages/Kontak.tsx`

Data dan state:
`src/hooks/useProducts.ts`, `src/hooks/useCart.ts`, `src/hooks/useCategories.ts`, `src/hooks/useLocalStorage.ts`

Firebase:
`src/database/firebase.ts`, `src/database/produk.ts`, `src/database/promo.ts`, `src/database/pesanan.ts`, `src/database/kategori.ts`

UI komponen:
`src/components/**`, `src/features/**`, `src/utils/**`

## Urutan Pembuatan Fitur (Step by Step)
1. Entry point dan routing halaman
File: `src/main.tsx`, `src/App.tsx`
Fungsi: Bootstrapping React dan memilih halaman aktif (beranda, cart, kelola, dsb).
Alur: `main.tsx` merender `App` -> `App` menyimpan state halaman -> render komponen halaman.

2. Model data dasar (produk, cart, promo)
File: `src/types/index.ts`
Fungsi: Mendefinisikan shape data agar konsisten di seluruh aplikasi.
Alur: Semua komponen dan hook memakai type dari file ini.

3. Data awal dan gambar
File: `src/data/products.ts`, `src/data/imageGallery.ts`, `src/utils/imageHelper.ts`
Fungsi: Menyediakan data produk default dan mapping gambar.
Alur: `imageHelper.ts` mengubah key gambar menjadi URL (preset atau custom).

4. State produk (Firebase-only)
File: `src/hooks/useProducts.ts`, `src/database/produk.ts`
Fungsi: Menyimpan dan mengambil data produk dari Firestore.
Alur: `useProducts` subscribe Firestore, menampilkan loading saat fetch, dan menampilkan error jika koneksi gagal.

5. Beranda (list produk, search, kategori, add to cart)
File: `src/pages/Beranda.tsx`, `src/components/features/ProductList.tsx`, `src/components/features/ProductCard.tsx`, `src/components/layout/CategoryNav.tsx`, `src/hooks/useCategories.ts`, `src/database/kategori.ts`
Fungsi: Menampilkan produk, filter kategori, search, sorting, dan tombol tambah ke keranjang.
Alur: `CategoryNav` memuat kategori dari Firebase -> `ProductList` memfilter -> `ProductCard` memanggil handler add to cart.

6. Keranjang belanja
File: `src/hooks/useCart.ts`, `src/pages/CartPage.tsx`
Fungsi: Menyimpan item yang dipilih user dan menghitung total.
Alur: `useCart` menyimpan cart di memory (reset saat reload) -> `CartPage` menampilkan isi dan total.

7. Checkout dan print kuitansi
File: `src/components/CheckoutModal.tsx`, `src/database/pesanan.ts`
Fungsi: Print, lalu simpan pesanan ke Firestore dan kurangi stok.
Alur: Klik "Print Kuitansi" -> `CheckoutModal` memanggil `simpanPesananDanKurangiStok` -> Firestore update stok dan simpan pesanan.

8. Admin (kelola produk, kategori, promo)
File: `src/pages/KelolaPage.tsx`, `src/features/admin/PasswordProtection.tsx`, `src/features/admin/ProductManagement.tsx`, `src/features/admin/CategoryManagement.tsx`, `src/features/admin/PromoManagement.tsx`
Fungsi: CRUD produk, kategori, dan banner promo.
Alur: `KelolaPage` menampilkan form setelah password benar -> masing-masing modul mengelola data.

9. Firebase setup dan struktur data
File: `.env`, `src/database/firebase.ts`, `src/CONTOH_DATA_FIRESTORE.md`
Fungsi: Menyambungkan project ke Firestore.
Alur: `firebase.ts` membaca `.env` -> `produk.ts`, `promo.ts`, `pesanan.ts` memakai koneksi ini.

## Alur Tiap Fitur (Ringkas)
Produk (tampil dan CRUD)
File: `src/hooks/useProducts.ts`, `src/database/produk.ts`, `src/data/products.ts`, `src/features/admin/ProductManagement.tsx`
Alur: Firestore tersedia -> data dari Firestore -> CRUD update Firestore. Jika gagal -> gunakan localStorage.

Keranjang
File: `src/hooks/useCart.ts`, `src/pages/CartPage.tsx`
Alur: add/update/remove hanya di state lokal (reset saat reload).

Checkout dan pengurangan stok
File: `src/components/CheckoutModal.tsx`, `src/database/pesanan.ts`
Alur: print -> simpan pesanan -> update stok produk di Firestore.

Promo diskon (checkout)
File: `src/database/promo.ts`, `src/pages/CartPage.tsx`
Alur: `CartPage` memanggil `getPromoConfig` -> jika aktif maka diskon diterapkan.

Banner promo (beranda)
File: `src/components/features/PromoBanner.tsx`, `src/features/admin/PromoManagement.tsx`, `src/database/promoBanner.ts`
Alur: banner promo diambil dari Firestore koleksi `promo_banner`, lalu ditampilkan ke user jika aktif.

Kategori
File: `src/hooks/useCategories.ts`, `src/database/kategori.ts`, `src/features/admin/CategoryManagement.tsx`, `src/components/layout/CategoryNav.tsx`
Alur: kategori dibaca dari Firestore, menampilkan loading saat fetch, dan menampilkan error jika koneksi gagal. Kategori dipakai untuk filter di `ProductList`.

Catatan update (bahasa mudah):
Sekarang kategori utama diambil langsung dari Firestore koleksi `kategori`.
Tidak ada fallback data lokal untuk kategori.
Jika Firebase bermasalah, aplikasi menampilkan pesan error agar masalah cepat terdeteksi.

## Sumber Data per Fitur
Produk: Firestore `produk` (Firebase-only)
Kategori: Firestore `kategori` (Firebase-only)
Keranjang: memory (reset saat reload)
Promo diskon: Firestore `konfigurasi/promo`
Banner promo: Firestore `promo_banner`
Pesanan: Firestore `pesanan`

## Checklist Cepat Jika Bingung
1. Cek data apa yang sedang dipakai (Firestore atau localStorage).
2. Cari hook utama fitur tersebut di folder `src/hooks`.
3. Lihat halaman utama fitur di `src/pages` atau `src/features`.
4. Lihat akses database di `src/database`.
5. Baca tipe data di `src/types/index.ts`.

Jika Anda mau, saya bisa menambahkan diagram alur atau membuat versi singkat satu halaman.

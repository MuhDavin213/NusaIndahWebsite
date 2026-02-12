# Diagram Alur Fitur (Flowchart Sederhana)

Gunakan diagram ini sebagai gambaran cepat alur utama aplikasi.

## 1. Alur Aplikasi Utama
```
User buka website
  -> main.tsx render App
    -> App set currentPage
      -> Beranda / Cart / Kelola / Tentang / Kontak
```

## 2. Alur Data Produk
```
App mount
  -> useProducts()
    -> subscribeProduk() ke Firestore
      -> Jika sukses: products = Firestore
      -> Jika gagal: products = localStorage (fallback)
```

## 3. Alur Add to Cart
```
User klik "Tambah ke Keranjang"
  -> ProductCard memanggil onAddToCart
    -> useCart.addToCart()
      -> Cart disimpan di memory (reset saat reload)
```

## 4. Alur Checkout + Print
```
User klik "Checkout"
  -> CheckoutModal
    -> Klik "Print Kuitansi"
      -> window.print()
      -> simpanPesananDanKurangiStok()
        -> Simpan pesanan ke Firestore
        -> Kurangi stok produk di Firestore
```

## 5. Alur Promo Diskon (Checkout)
```
CartPage mount
  -> getPromoConfig() dari Firestore (konfigurasi/promo)
    -> Jika aktif: diskon dihitung
    -> Jika tidak: diskon = 0
```

## 6. Alur Admin Kelola
```
User buka halaman Kelola
  -> PasswordProtection
    -> Jika password benar
      -> ProductManagement / CategoryManagement / PromoManagement
```

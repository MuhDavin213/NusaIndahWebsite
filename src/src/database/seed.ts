import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { KOLEKSI } from './koleksi';

/**
 * SEED DATABASE - 22 PRODUK AWAL
 * 
 * Cara menjalankan:
 * 1. Panggil fungsi seedDatabase() dari console browser atau button admin
 * 2. Atau jalankan sekali saat pertama kali load app
 * 
 * PENTING: Fungsi ini hanya perlu dijalankan SEKALI!
 * Cek dulu apakah sudah ada data sebelum seed.
 */

export const dataProdukAwal = [
  {
    nama: 'Indomie Goreng',
    deskripsi: 'Mie instan rasa goreng original, favorit keluarga Indonesia',
    kategori: 'Makanan & Minuman',
    harga: 3500,
    stok: 100,
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
    aktif: true,
  },
  {
    nama: 'Mie Sedaap Soto',
    deskripsi: 'Mie instan dengan rasa soto yang lezat dan gurih',
    kategori: 'Makanan & Minuman',
    harga: 3000,
    stok: 80,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    aktif: true,
  },
  {
    nama: 'Aqua 600ml',
    deskripsi: 'Air mineral dalam kemasan botol 600ml',
    kategori: 'Makanan & Minuman',
    harga: 3000,
    stok: 150,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    aktif: true,
  },
  {
    nama: 'Teh Botol Sosro',
    deskripsi: 'Minuman teh kemasan botol rasa original',
    kategori: 'Makanan & Minuman',
    harga: 5000,
    stok: 120,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    aktif: true,
  },
  {
    nama: 'Chitato Rasa Sapi Panggang',
    deskripsi: 'Keripik kentang renyah dengan rasa sapi panggang',
    kategori: 'Snack',
    harga: 8500,
    stok: 50,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    aktif: true,
  },
  {
    nama: 'Oreo Vanilla',
    deskripsi: 'Biskuit sandwich dengan krim vanilla yang manis',
    kategori: 'Snack',
    harga: 12000,
    stok: 40,
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400',
    aktif: true,
  },
  {
    nama: 'Nabati Richeese',
    deskripsi: 'Wafer keju dengan rasa richeese yang lezat',
    kategori: 'Snack',
    harga: 3500,
    stok: 60,
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
    aktif: true,
  },
  {
    nama: 'Permen Kopiko',
    deskripsi: 'Permen kopi dengan rasa kopi asli yang kuat',
    kategori: 'Snack',
    harga: 5000,
    stok: 70,
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
    aktif: true,
  },
  {
    nama: 'Boneka Teddy Bear Coklat',
    deskripsi: 'Boneka beruang lembut warna coklat ukuran medium',
    kategori: 'Boneka',
    harga: 75000,
    stok: 15,
    imageUrl: 'https://images.unsplash.com/photo-1551199591-3f0447c7c5bc?w=400',
    aktif: true,
  },
  {
    nama: 'Boneka Unicorn',
    deskripsi: 'Boneka unicorn lucu dengan warna-warna cerah',
    kategori: 'Boneka',
    harga: 85000,
    stok: 12,
    imageUrl: 'https://images.unsplash.com/photo-1565514157715-0bd8b2069398?w=400',
    aktif: true,
  },
  {
    nama: 'Boneka Panda',
    deskripsi: 'Boneka panda menggemaskan hitam putih',
    kategori: 'Boneka',
    harga: 70000,
    stok: 10,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    aktif: true,
  },
  {
    nama: 'Mobil Remote Control',
    deskripsi: 'Mobil mainan dengan remote control untuk anak',
    kategori: 'Mainan',
    harga: 150000,
    stok: 8,
    imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
    aktif: true,
  },
  {
    nama: 'Lego Building Blocks',
    deskripsi: 'Set lego dengan berbagai bentuk dan warna',
    kategori: 'Mainan',
    harga: 120000,
    stok: 20,
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    aktif: true,
  },
  {
    nama: 'Puzzle 1000 Pieces',
    deskripsi: 'Puzzle 1000 keping dengan gambar pemandangan',
    kategori: 'Mainan',
    harga: 65000,
    stok: 15,
    imageUrl: 'https://images.unsplash.com/photo-1587654780119-4c49c71c6ba0?w=400',
    aktif: true,
  },
  {
    nama: 'Sapu Lantai',
    deskripsi: 'Sapu dengan gagang panjang untuk membersihkan lantai',
    kategori: 'Peralatan',
    harga: 25000,
    stok: 30,
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
    aktif: true,
  },
  {
    nama: 'Pel Kain Microfiber',
    deskripsi: 'Pel dengan kain microfiber untuk hasil bersih maksimal',
    kategori: 'Peralatan',
    harga: 45000,
    stok: 25,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400',
    aktif: true,
  },
  {
    nama: 'Ember Plastik 10 Liter',
    deskripsi: 'Ember plastik berkualitas dengan kapasitas 10 liter',
    kategori: 'Peralatan',
    harga: 20000,
    stok: 40,
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
    aktif: true,
  },
  {
    nama: 'Kain Lap',
    deskripsi: 'Kain lap serbaguna untuk membersihkan permukaan',
    kategori: 'Peralatan',
    harga: 5000,
    stok: 100,
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
    aktif: true,
  },
  {
    nama: 'Sabun Cuci Piring',
    deskripsi: 'Sabun cuci piring formula anti bakteri',
    kategori: 'Perlengkapan Rumah',
    harga: 15000,
    stok: 50,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400',
    aktif: true,
  },
  {
    nama: 'Detergen 1kg',
    deskripsi: 'Detergen bubuk untuk mencuci pakaian 1kg',
    kategori: 'Perlengkapan Rumah',
    harga: 18000,
    stok: 60,
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
    aktif: true,
  },
  {
    nama: 'Tisu Toilet',
    deskripsi: 'Tisu toilet lembut isi 10 roll',
    kategori: 'Perlengkapan Rumah',
    harga: 22000,
    stok: 45,
    imageUrl: 'https://images.unsplash.com/photo-1584305574647-0cc949a8f6ce?w=400',
    aktif: true,
  },
  {
    nama: 'Sabun Mandi Cair',
    deskripsi: 'Sabun mandi cair dengan aroma menyegarkan 500ml',
    kategori: 'Perlengkapan Rumah',
    harga: 25000,
    stok: 35,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400',
    aktif: true,
  },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Memulai seed database...');
    
    // Seed Produk
    console.log('📦 Menambahkan produk...');
    for (const produk of dataProdukAwal) {
      await addDoc(collection(db, KOLEKSI.PRODUK), {
        ...produk,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    console.log(`✅ Berhasil menambahkan ${dataProdukAwal.length} produk`);
    
    // Seed Promo
    console.log('🎉 Membuat promo awal...');
    const promoRef = doc(db, KOLEKSI.PROMO, 'utama');
    await setDoc(promoRef, {
      isActive: true,
      text: '🎉 Diskon 10% untuk semua produk! Belanja sekarang!',
      discountType: 'PERCENT',
      discountValue: 10,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Promo berhasil dibuat');
    
    console.log('🎊 SEED DATABASE SELESAI!');
    console.log(`Total produk: ${dataProdukAwal.length}`);
    
    return {
      success: true,
      message: `Berhasil seed ${dataProdukAwal.length} produk`,
    };
  } catch (error: any) {
    console.error('❌ Error seed database:', error);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Fungsi helper untuk cek apakah database sudah ter-seed
 */
export async function cekDatabaseKosong(): Promise<boolean> {
  try {
    const { getDocs, collection } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, KOLEKSI.PRODUK));
    return snapshot.empty;
  } catch (error) {
    console.error('Error cek database:', error);
    return true;
  }
}

import type { Barang } from '../types';

export const initialProducts: Barang[] = [
  // Makanan & Minuman
  {
    id_barang: 1,
    id_user: 1,
    nama_barang: 'Indomie Goreng',
    deskripsi: 'Mie instan goreng rasa original, favorit keluarga Indonesia',
    harga: 3500,
    stok: 100,
    gambar: 'noodles',
    kategori: 'Makanan & Minuman'
  },
  {
    id_barang: 2,
    id_user: 1,
    nama_barang: 'Aqua Botol 600ml',
    deskripsi: 'Air mineral dalam kemasan botol praktis untuk dibawa',
    harga: 4000,
    stok: 120,
    gambar: 'drink',
    kategori: 'Makanan & Minuman'
  },
  {
    id_barang: 3,
    id_user: 1,
    nama_barang: 'Roti Tawar Sari Roti',
    deskripsi: 'Roti tawar lembut untuk sarapan, isi 10 lembar',
    harga: 15000,
    stok: 30,
    gambar: 'bread',
    kategori: 'Makanan & Minuman'
  },
  {
    id_barang: 4,
    id_user: 1,
    nama_barang: 'Susu Ultra Milk 1L',
    deskripsi: 'Susu UHT full cream dalam kemasan karton 1 liter',
    harga: 18000,
    stok: 45,
    gambar: 'milk',
    kategori: 'Makanan & Minuman'
  },
  {
    id_barang: 22,
    id_user: 1,
    nama_barang: 'Kopi Kapal Api',
    deskripsi: 'Kopi bubuk special mix, aroma khas Indonesia, 165g',
    harga: 16000,
    stok: 45,
    gambar: 'coffee',
    kategori: 'Makanan & Minuman'
  },
  // Snack & Permen
  {
    id_barang: 5,
    id_user: 1,
    nama_barang: 'Chitato Rasa Sapi Panggang',
    deskripsi: 'Keripik kentang renyah dengan bumbu sapi panggang yang gurih',
    harga: 12000,
    stok: 50,
    gambar: 'chips',
    kategori: 'Snack & Permen'
  },
  {
    id_barang: 6,
    id_user: 1,
    nama_barang: 'Permen Kopiko',
    deskripsi: 'Permen rasa kopi asli yang menyegarkan, isi 10 pcs',
    harga: 5000,
    stok: 80,
    gambar: 'candy',
    kategori: 'Snack & Permen'
  },
  {
    id_barang: 7,
    id_user: 1,
    nama_barang: 'Biskuit Roma Kelapa',
    deskripsi: 'Biskuit kelapa manis dan renyah, cocok untuk camilan',
    harga: 8500,
    stok: 60,
    gambar: 'cookies',
    kategori: 'Snack & Permen'
  },
  {
    id_barang: 8,
    id_user: 1,
    nama_barang: 'Cokelat Silverqueen',
    deskripsi: 'Cokelat susu premium rasa almond, 65 gram',
    harga: 17000,
    stok: 40,
    gambar: 'chocolate',
    kategori: 'Snack & Permen'
  },
  // Kebutuhan Rumah Tangga
  {
    id_barang: 9,
    id_user: 1,
    nama_barang: 'Sabun Cuci Piring Sunlight',
    deskripsi: 'Sabun cuci piring anti bakteri, aroma jeruk nipis, 750ml',
    harga: 18000,
    stok: 30,
    gambar: 'soap',
    kategori: 'Kebutuhan Rumah Tangga'
  },
  {
    id_barang: 10,
    id_user: 1,
    nama_barang: 'Tisu Paseo',
    deskripsi: 'Tisu wajah lembut 2 ply, isi 250 lembar',
    harga: 15000,
    stok: 40,
    gambar: 'tissue',
    kategori: 'Kebutuhan Rumah Tangga'
  },
  {
    id_barang: 11,
    id_user: 1,
    nama_barang: 'Pembersih Lantai Wipol',
    deskripsi: 'Cairan pembersih lantai anti kuman, aroma lavender, 800ml',
    harga: 22000,
    stok: 35,
    gambar: 'cleaner',
    kategori: 'Kebutuhan Rumah Tangga'
  },
  {
    id_barang: 12,
    id_user: 1,
    nama_barang: 'Detergen Rinso Bubuk',
    deskripsi: 'Detergen bubuk untuk pakaian lebih bersih dan wangi, 800g',
    harga: 25000,
    stok: 28,
    gambar: 'detergent',
    kategori: 'Kebutuhan Rumah Tangga'
  },
  // Mainan & Boneka
  {
    id_barang: 13,
    id_user: 1,
    nama_barang: 'Boneka Beruang Teddy',
    deskripsi: 'Boneka beruang lembut dan lucu, ukuran sedang 30cm',
    harga: 45000,
    stok: 15,
    gambar: 'teddy',
    kategori: 'Mainan & Boneka'
  },
  {
    id_barang: 14,
    id_user: 1,
    nama_barang: 'Mobil-mobilan Hot Wheels',
    deskripsi: 'Mainan mobil die-cast Hot Wheels koleksi terbaru',
    harga: 25000,
    stok: 25,
    gambar: 'toy',
    kategori: 'Mainan & Boneka'
  },
  {
    id_barang: 15,
    id_user: 1,
    nama_barang: 'Puzzle 100 Pieces',
    deskripsi: 'Puzzle edukatif untuk anak, gambar pemandangan alam',
    harga: 35000,
    stok: 20,
    gambar: 'puzzle',
    kategori: 'Mainan & Boneka'
  },
  {
    id_barang: 16,
    id_user: 1,
    nama_barang: 'Boneka Barbie',
    deskripsi: 'Boneka fashion Barbie dengan aksesoris lengkap',
    harga: 65000,
    stok: 12,
    gambar: 'doll',
    kategori: 'Mainan & Boneka'
  },
  // Alat Tulis
  {
    id_barang: 17,
    id_user: 1,
    nama_barang: 'Pensil 2B Faber Castell',
    deskripsi: 'Pensil 2B berkualitas, isi 12 batang per box',
    harga: 24000,
    stok: 50,
    gambar: 'pencil',
    kategori: 'Alat Tulis'
  },
  {
    id_barang: 18,
    id_user: 1,
    nama_barang: 'Buku Tulis Sinar Dunia 58 Lembar',
    deskripsi: 'Buku tulis bergaris, ukuran folio, kertas HVS',
    harga: 6000,
    stok: 100,
    gambar: 'notebook',
    kategori: 'Alat Tulis'
  },
  {
    id_barang: 19,
    id_user: 1,
    nama_barang: 'Pulpen Standard AE7',
    deskripsi: 'Pulpen tinta hitam, tulisan halus dan lancar',
    harga: 3000,
    stok: 80,
    gambar: 'pen',
    kategori: 'Alat Tulis'
  },
  // Perawatan Pribadi
  {
    id_barang: 20,
    id_user: 1,
    nama_barang: 'Pasta Gigi Pepsodent',
    deskripsi: 'Pasta gigi untuk perlindungan gigi berlubang, 190g',
    harga: 14000,
    stok: 55,
    gambar: 'toothpaste',
    kategori: 'Perawatan Pribadi'
  },
  {
    id_barang: 21,
    id_user: 1,
    nama_barang: 'Shampo Pantene 170ml',
    deskripsi: 'Shampo untuk rambut lembut dan berkilau',
    harga: 23000,
    stok: 38,
    gambar: 'shampoo',
    kategori: 'Perawatan Pribadi'
  }
];

export const categories = [
  'Semua',
  'Makanan & Minuman',
  'Snack & Permen',
  'Kebutuhan Rumah Tangga',
  'Mainan & Boneka',
  'Alat Tulis',
  'Perawatan Pribadi'
];

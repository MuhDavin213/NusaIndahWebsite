export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Toko Nusa Indah';

// UBAH DI SINI: Password admin (untuk production gunakan Firebase Auth)
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'nusaindah123';

export const KONTAK = {
  alamat: 'Jl. Raya Merdeka No. 123, Kelurahan Sejahtera, Jakarta Selatan 12345',
  telepon: '(021) 1234-5678',
  whatsapp: '6281234567890',
  email: 'info@tokonusaindah.com',
} as const;

export const JAM_BUKA = {
  senin_jumat: '08:00 - 20:00',
  sabtu: '08:00 - 22:00',
  minggu: '10:00 - 18:00',
} as const;

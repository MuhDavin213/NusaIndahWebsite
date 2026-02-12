import { useState, useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { simpanPesananDanKurangiStok } from '../database/pesanan';
import { getPromoAktif, type PromoFirebase } from '../database/promo';
import type { Keranjang } from '../types';

interface Props {
  cart: Keranjang;
  onBack: () => void;
  onSuccess: () => void; // Clear cart & redirect
}

export function CheckoutPage({ cart, onBack, onSuccess }: Props) {
  const [promo, setPromo] = useState<PromoFirebase | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // Load promo aktif
  useEffect(() => {
    getPromoAktif()
      .then(setPromo)
      .catch(error => {
        console.warn('Promo feature disabled:', error.message);
        setPromo(null);
      });
  }, []);

  // Hitung total
  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Promo auto-apply
  const diskon = promo ? Math.floor((subtotal * promo.persen) / 100) : 0;
  const total = subtotal - diskon;

  // HANDLE PRINT & SAVE
  const handlePrintDanSimpan = async () => {
    // 1. PRINT dulu
    window.print();
    
    // 2. SIMPAN ke Firebase + KURANGI STOK
    setStatus('saving');
    
    const result = await simpanPesananDanKurangiStok({
      items: cart.items.map(item => ({
        productId: item.id_barang,
        nama: item.nama_barang,
        harga: item.harga,
        qty: item.jumlah,
        subtotal: item.subtotal,
      })),
      subtotal,
      diskon,
      total,
      promoTeks: promo?.teks,
      promoPersen: promo?.persen,
    });

    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        onSuccess(); // Clear cart & redirect
      }, 1500);
    } else {
      setStatus('error');
      setError(result.error || 'Gagal menyimpan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-lg no-print"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Ringkasan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print">
          <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>
          
          {/* Items */}
          <div className="space-y-3 mb-6 border-b pb-4">
            {cart.items.map(item => (
              <div key={item.id_detail} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.nama_barang}</p>
                  <p className="text-sm text-gray-600">
                    Rp {item.harga.toLocaleString()} × {item.jumlah}
                  </p>
                </div>
                <p className="font-semibold">
                  Rp {item.subtotal.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            
            {promo && diskon > 0 && (
              <div className="flex justify-between text-emerald-600">
                <div>
                  <p className="font-semibold">Promo diterapkan:</p>
                  <p className="text-sm">{promo.teks}</p>
                </div>
                <span className="font-semibold">
                  - Rp {diskon.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between text-2xl font-bold border-t-2 pt-3">
              <span>Total:</span>
              <span className="text-emerald-600">
                Rp {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Button Print */}
        {status === 'idle' && (
          <button
            onClick={handlePrintDanSimpan}
            className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-3 text-lg no-print"
          >
            <Printer className="w-6 h-6" />
            Print Kuitansi & Simpan
          </button>
        )}

        {/* Loading */}
        {status === 'saving' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 no-print">
            <p className="text-blue-800">Menyimpan transaksi...</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 no-print">
            <p className="text-green-800 font-semibold">✅ Transaksi berhasil!</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="space-y-3 no-print">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">❌ {error}</p>
            </div>
            <button
              onClick={handlePrintDanSimpan}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Kuitansi (untuk print) */}
        <div className="hidden print:block">
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">TOKO NUSA INDAH</h1>
              <p className="text-sm">Jl. Raya Merdeka No. 123</p>
            </div>
            
            <div className="border-t-2 border-b-2 py-3 mb-4">
              <h2 className="text-xl font-bold text-center">KUITANSI</h2>
            </div>

            <table className="w-full mb-6">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Produk</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Harga</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map(item => (
                  <tr key={item.id_detail} className="border-b">
                    <td className="py-2">{item.nama_barang}</td>
                    <td className="text-center">{item.jumlah}</td>
                    <td className="text-right">Rp {item.harga.toLocaleString()}</td>
                    <td className="text-right">Rp {item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-2 border-t-2 pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              {promo && diskon > 0 && (
                <div className="flex justify-between">
                  <span>Diskon ({promo.teks}):</span>
                  <span>- Rp {diskon.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>TOTAL:</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center mt-8 text-sm">
              <p>Terima kasih atas pembelian Anda!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
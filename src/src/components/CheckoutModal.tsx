// MODAL CHECKOUT - POPUP SAAT KLIK CHECKOUT
import { X, Printer, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { simpanPesananDanKurangiStok } from '../database/pesanan';
import type { Keranjang } from '../types';
import type { PromoFirebase } from '../database/promo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Keranjang;
  subtotal: number;
  diskon: number;
  promoData: PromoFirebase | null;
  onSuccess: () => void; // Clear cart setelah sukses
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  subtotal,
  diskon,
  promoData,
  onSuccess,
}: CheckoutModalProps) {
  const [status, setStatus] = useState<'idle' | 'printing' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  const total = subtotal - diskon;

  if (!isOpen) return null;

  // HANDLE PRINT KUITANSI + SIMPAN + UPDATE STOK
  const handlePrintDanSimpan = async () => {
    // Cegah double click
    if (isPrinting || status === 'saving' || status === 'success') return;
    
    setIsPrinting(true);
    setStatus('printing');

    try {
      // 1. PRINT DULU
      window.print();
      
      // 2. SIMPAN KE FIREBASE + KURANGI STOK (ATOMIC)
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
        promoTeks: promoData?.teks,
        promoPersen: promoData?.persen,
      });

      if (result.success) {
        setStatus('success');
        
        // Tunggu 1.5 detik lalu clear cart & close
        setTimeout(() => {
          onSuccess(); // Clear cart
          onClose();
          setStatus('idle');
          setIsPrinting(false);
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMsg(error.message || 'Gagal menyimpan pesanan');
      setIsPrinting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 no-print"
        onClick={status === 'idle' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full relative">
            {/* Close Button */}
            {status === 'idle' && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg no-print"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Ringkasan Checkout</h2>

              {/* Daftar Item */}
              <div className="space-y-3 mb-6 border-b pb-6">
                {cart.items.map((item) => (
                  <div key={item.id_detail} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.nama_barang}</p>
                      <p className="text-sm text-gray-600">
                        Rp {item.harga.toLocaleString('id-ID')} × {item.jumlah}
                      </p>
                    </div>
                    <p className="font-semibold">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {promoData && diskon > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <div>
                      <span className="font-semibold">Promo:</span>
                      <p className="text-sm text-gray-600">{promoData.teks}</p>
                    </div>
                    <span className="font-semibold">
                      - Rp {diskon.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-2xl font-bold border-t-2 pt-3">
                  <span>Total:</span>
                  <span className="text-emerald-600">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Status Messages */}
              {status === 'saving' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 no-print">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                    <p className="text-blue-800 font-medium">
                      Menyimpan transaksi & update stok...
                    </p>
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 no-print">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-semibold">
                      ✓ Transaksi berhasil disimpan!
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 no-print">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-semibold mb-1">
                        Gagal menyimpan transaksi
                      </p>
                      <p className="text-red-700 text-sm">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tombol Print */}
              {status === 'idle' && (
                <button
                  onClick={handlePrintDanSimpan}
                  className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 text-lg font-semibold no-print"
                >
                  <Printer className="w-6 h-6" />
                  Print Kuitansi
                </button>
              )}

              {status === 'error' && (
                <div className="space-y-3 no-print">
                  <button
                    onClick={handlePrintDanSimpan}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Coba Lagi
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>

            {/* Kuitansi (Hidden, untuk print) */}
            <div className="hidden print:block p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">TOKO NUSA INDAH</h1>
                <p className="text-sm mt-2">Jl. Raya Merdeka No. 123, Jakarta</p>
                <p className="text-sm">Telp: (021) 1234-5678</p>
              </div>

              <div className="border-t-2 border-b-2 py-3 mb-6">
                <h2 className="text-xl font-bold text-center">KUITANSI PEMBAYARAN</h2>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-2">Produk</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Harga</th>
                    <th className="text-right py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{item.nama_barang}</td>
                      <td className="text-center">{item.jumlah}</td>
                      <td className="text-right">Rp {item.harga.toLocaleString('id-ID')}</td>
                      <td className="text-right">Rp {item.subtotal.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 border-t-2 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {promoData && diskon > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon ({promoData.teks}):</span>
                    <span>- Rp {diskon.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>TOTAL:</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-center mt-8 text-sm border-t pt-6">
                <p className="font-semibold">Terima kasih atas pembelian Anda!</p>
                <p className="mt-2">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
